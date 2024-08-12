/* eslint-disable no-console */
import fs from "fs"
import inquirer from "inquirer"
import { getUrl, getUser, saveConfig } from "./config"
import { finishUpload, prepareUpload, uploadFiles, validation } from "./upload"
import { createDataset, getDatasetFiles } from "./datasets"
import { getSnapshots } from "./snapshots.js"
import { getDownload } from "./download.js"
import { configuredClient } from "./configuredClient.js"
import { validateApiKey } from "./validateApiKey"
import { lsSnapshot } from "./ls.js"

/**
 * Login action to save an auth key locally
 *
 * The user can do this manually as well, to allow for automation
 * this is a prompted entry
 */
export const login = () => {
  return inquirer
    .prompt({
      type: "list",
      name: "url",
      message: "Choose an OpenNeuro instance to use.",
      choices: [
        "https://openneuro.org/",
        "https://staging.openneuro.org/",
        "http://localhost:9876/",
      ],
      default: "https://openneuro.org/",
    })
    .then(async (answers) =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: "password",
          name: "apikey",
          message:
            `Enter your API key for OpenNeuro (get an API key from ${answers.url}keygen)`,
          validate: validateApiKey,
        }),
      )
    )
    .then(async (answers) =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: "confirm",
          name: "errorReporting",
          message:
            "Do you want to enable error reporting to help improve openneuro-cli?",
        }),
      )
    )
    .then(saveConfig)
}

const uploadDataset = async (
  dir,
  datasetId,
  validatorOptions,
  { affirmedDefaced, affirmedConsent } = {
    affirmedDefaced: null,
    affirmedConsent: null,
  },
) => {
  const client = configuredClient()
  await validation(dir, validatorOptions)
  let remoteFiles = []
  if (datasetId) {
    // Check for dataset -> validation -> upload
    // Get remote files and filter successful files out
    // eslint-disable-next-line no-console
    console.log("Checking remote files...")
    remoteFiles = await getDatasetFiles(client, datasetId)
  } else {
    // Validation -> create dataset -> upload
    datasetId = await createDataset(client)({
      affirmedDefaced,
      affirmedConsent,
    })
    // eslint-disable-next-line no-console
    console.log(`"${datasetId}" created`)
    remoteFiles = [] // New dataset has no remote files
  }
  const preparedUpload = await prepareUpload(client, dir, {
    datasetId,
    remoteFiles,
  })
  if (preparedUpload) {
    if (preparedUpload.files.length > 1) {
      await uploadFiles(preparedUpload)
      await finishUpload(client, preparedUpload.id)
    } else {
      console.log("No files remaining to upload, exiting.")
    }
    return datasetId
  }
}

const notifyUploadComplete = (update, datasetId) => {
  console.log(
    "=======================================================================",
  )
  console.log("Upload Complete")
  console.log(
    update
      ? `To publish the update go to ${getUrl()}datasets/${datasetId} and create a new snapshot`
      : `To publish your dataset go to ${getUrl()}datasets/${datasetId}`,
  )
  console.log(
    "=======================================================================",
  )
}

const specificErrorTest = (err, targetErrMessage) =>
  err.message &&
  typeof err.message === "string" &&
  err.message.includes(targetErrMessage)

function isNotLoggedInError(err) {
  return specificErrorTest(err, "You must be logged in to create a dataset.")
}

function isMissingDotOpenneuroError(err) {
  return specificErrorTest(
    err,
    'The "path" argument must be one of type string, Buffer, or URL',
  )
}

function logSpecificError(errors) {
  errors.forEach((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
  })
}

function handleGenericErrors(err, dir) {
  // eslint-disable-next-line no-console
  console.error(err)
  // eslint-disable-next-line no-console
  console.error(`"${dir}" may not exist or is inaccessible`)
}

/**
 * Upload files to a dataset draft
 *
 * @param {string} dir
 * @param {Object} cmd
 */
export const upload = (dir, cmd) => {
  try {
    if (!fs.statSync(dir).isDirectory()) {
      throw new Error(`"${dir}" must be a directory`)
    }
    const validatorOptions = {
      ignoreWarnings: cmd.ignoreWarnings,
      ignoreNiftiHeaders: cmd.ignoreNiftiHeaders,
      ignoreSubjectConsistency: cmd.ignoreSubjectConsistency,
      verbose: cmd.verbose,
      blacklistModalities: ["Microscopy"],
    }
    if (cmd.dataset) {
      // eslint-disable-next-line no-console
      console.log(`Adding files to "${cmd.dataset}"`)
      uploadDataset(dir, cmd.dataset, validatorOptions).then((datasetId) => {
        if (datasetId) {
          notifyUploadComplete("update", cmd.dataset)
        }
      })
    } else {
      inquirer
        .prompt([
          {
            type: "confirm",
            name: "yes",
            default: true,
            message: "This will create a new dataset, continue?",
          },
          {
            type: "list",
            name: "affirmed",
            message: "Please affirm one of the following:",
            choices: [
              "All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.",
              "I have explicit participant consent and ethical authorization to publish structural scans without defacing.",
            ],
          },
        ])
        .then(({ yes, affirmed: [affirmedDefaced, affirmedConsent] }) => {
          if (yes) {
            return uploadDataset(dir, cmd.dataset, validatorOptions, {
              affirmedDefaced: !!affirmedDefaced,
              affirmedConsent: !!affirmedConsent,
            }).then((datasetId) => {
              if (datasetId) {
                notifyUploadComplete(false, datasetId)
              }
            })
          }
        })
        .catch((err) => {
          if (isNotLoggedInError(err)) {
            logSpecificError([
              err.message,
              'Please use the command "openneuro login" and follow instructions, then try again.',
            ])
          } else if (isMissingDotOpenneuroError(err)) {
            logSpecificError([
              err.message,
              'You may be missing the ~/.openneuro configuration file, please use the command "openneuro login" and follow instructions, then try again.',
            ])
          } else {
            handleGenericErrors(err, dir)
          }
          process.exit(1)
        })
    }
  } catch (e) {
    handleGenericErrors(e, dir)
    process.exit(1)
  }
}

const promptTags = (snapshots) =>
  inquirer.prompt({
    type: "list",
    name: "tag",
    message: "Choose a snapshot",
    choices: snapshots,
    default: snapshots[0],
  })

/**
 * Download a draft or snapshot from a dataset
 *
 * @param {string} datasetId
 * @param {Object} cmd
 */
export const download = (datasetId, destination, cmd) => {
  const client = configuredClient()
  if (!cmd.draft && !cmd.snapshot) {
    return getSnapshots(client)(datasetId).then(({ data }) => {
      if (data.dataset && data.dataset.snapshots) {
        const tags = data.dataset.snapshots.map((snap) => snap.tag)
        tags.reverse()
        return promptTags(tags).then((choices) =>
          getDownload(
            destination,
            datasetId,
            choices.tag,
            client,
          )
        )
      }
    })
  } else if (cmd.snapshot) {
    return getDownload(
      destination,
      datasetId,
      cmd.snapshot,
      client,
    )
  } else {
    return getDownload(destination, datasetId, null, client)
  }
}

/**
 * List files for a snapshot
 *
 * @param {string} datasetId
 * @param {object} cmd
 */
export const ls = (datasetId, cmd) => {
  const client = configuredClient()
  if (!cmd.snapshot) {
    return getSnapshots(client)(datasetId).then(({ data }) => {
      if (data.dataset && data.dataset.snapshots) {
        const tags = data.dataset.snapshots.map((snap) => snap.tag)
        tags.reverse()
        return promptTags(tags).then((choices) => {
          lsSnapshot(client, datasetId, choices.tag)
        })
      }
    })
  } else {
    return lsSnapshot(client, datasetId, cmd.snapshot)
  }
}
