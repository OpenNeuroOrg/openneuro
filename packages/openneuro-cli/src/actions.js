/* eslint-disable no-console */
import fs from 'fs'
import inquirer from 'inquirer'
import { apm } from './apm.js'
import { saveConfig, getUrl, getUser } from './config'
import { validation, prepareUpload, uploadFiles, finishUpload } from './upload'
import { getDatasetFiles, createDataset } from './datasets'
import { getSnapshots } from './snapshots.js'
import { getDownload } from './download.js'
import { configuredClient } from './configuredClient.js'

/**
 * Login action to save an auth key locally
 *
 * The user can do this manually as well, to allow for automation
 * this is a prompted entry
 */
export const login = () => {
  return inquirer
    .prompt({
      type: 'list',
      name: 'url',
      message: 'Choose an OpenNeuro instance to use.',
      choices: [
        'https://openneuro.org/',
        'https://openneuro.staging.sqm.io/',
        'http://localhost:9876/',
      ],
      default: 'https://openneuro.org/',
    })
    .then(async answers =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: 'password',
          name: 'apikey',
          message: `Enter your API key for OpenNeuro (get an API key from ${answers.url}keygen)`,
        }),
      ),
    )
    .then(async answers =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: 'confirm',
          name: 'errorReporting',
          message:
            'Do you want to enable error reporting to help improve openneuro-cli?',
        }),
      ),
    )
    .then(saveConfig)
}

const uploadDataset = async (
  dir,
  datasetId,
  validatorOptions,
  { affirmedDefaced, affirmedConsent },
) => {
  const apmTransaction = apm && apm.startTransaction('upload', 'custom')
  apmTransaction.addLabels({ datasetId })
  const client = configuredClient()
  await validation(dir, validatorOptions)
  let remoteFiles = []
  if (datasetId) {
    // Check for dataset -> validation -> upload
    // Get remote files and filter successful files out
    const { data } = await getDatasetFiles(client, datasetId)
    remoteFiles = data.dataset.draft.files
  } else {
    // Validation -> create dataset -> upload
    datasetId = await createDataset(client)({
      affirmedDefaced,
      affirmedConsent,
    })
    remoteFiles = [] // New dataset has no remote files
  }
  const apmPrepareUploadSpan =
    apmTransaction && apmTransaction.startSpan('prepareUpload')
  const preparedUpload = await prepareUpload(client, dir, {
    datasetId,
    remoteFiles,
  })
  apmPrepareUploadSpan.end()
  if (preparedUpload) {
    if (preparedUpload.files.length > 1) {
      const apmUploadFilesSpan =
        apmTransaction && apmTransaction.startSpan('uploadFiles')
      await uploadFiles(preparedUpload)
      apmUploadFilesSpan && apmUploadFilesSpan.end()
      const apmFinishUploadSpan =
        apmTransaction && apmTransaction.startSpan('finishUpload')
      await finishUpload(client, preparedUpload.id)
      apmUploadFilesSpan && apmFinishUploadSpan.end()
    } else {
      console.log('No files remaining to upload, exiting.')
    }
    apmTransaction && apmTransaction.end()
    return datasetId
  }
}

const notifyUploadComplete = (update, datasetId) => {
  console.log(
    '=======================================================================',
  )
  console.log('Upload Complete')
  console.log(
    update
      ? `To publish the update go to ${getUrl()}datasets/${datasetId} and create a new snapshot`
      : `To publish your dataset go to ${getUrl()}datasets/${datasetId}`,
  )
  console.log(
    '=======================================================================',
  )
}

const specificErrorTest = (err, targetErrMessage) =>
  err.message &&
  typeof err.message === 'string' &&
  err.message.includes(targetErrMessage)

function isNotLoggedInError(err) {
  return specificErrorTest(err, 'You must be logged in to create a dataset.')
}

function isMissingDotOpenneuroError(err) {
  return specificErrorTest(
    err,
    'The "path" argument must be one of type string, Buffer, or URL',
  )
}

function logSpecificError(errors) {
  errors.forEach(err => {
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
    }
    if (cmd.dataset) {
      // eslint-disable-next-line no-console
      console.log(`Adding files to "${cmd.dataset}"`)
      uploadDataset(dir, cmd.dataset, validatorOptions).then(datasetId => {
        if (datasetId) {
          notifyUploadComplete('update', cmd.dataset)
        }
      })
    } else {
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'yes',
            default: true,
            message: 'This will create a new dataset, continue?',
          },
          {
            type: 'checkbox',
            name: 'affirmed',
            message: 'Please affirm one of the following:',
            choices: [
              'All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.',
              'I have explicit participant consent and ethical authorization to publish structural scans without defacing.',
            ],
          },
        ])
        .then(({ yes, affirmed: [affirmedDefaced, affirmedConsent] }) => {
          if (yes) {
            return uploadDataset(dir, cmd.dataset, validatorOptions, {
              affirmedDefaced: !!affirmedDefaced,
              affirmedConsent: !!affirmedConsent,
            }).then(datasetId => {
              if (datasetId) {
                notifyUploadComplete(false, datasetId)
              }
            })
          }
        })
        .catch(err => {
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

const promptTags = snapshots =>
  inquirer.prompt({
    type: 'list',
    name: 'tag',
    message: 'Choose a snapshot',
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
  const apmTransaction = apm.startTransaction(
    `download:${datasetId}`,
    'download',
  )
  const { sub } = getUser()
  apmTransaction.addLabels({ datasetId, userId: sub })
  if (cmd.snapshot) {
    apmTransaction.addLabels({ snapshot: cmd.snapshot })
  }
  if (!cmd.draft && !cmd.snapshot) {
    const client = configuredClient()
    return getSnapshots(client)(datasetId).then(({ data }) => {
      if (data.dataset && data.dataset.snapshots) {
        const tags = data.dataset.snapshots.map(snap => snap.tag)
        return promptTags(tags).then(choices =>
          getDownload(destination, datasetId, choices.tag, apmTransaction),
        )
      }
    })
  } else if (cmd.snapshot) {
    getDownload(destination, datasetId, cmd.snapshot, apmTransaction)
  } else {
    getDownload(destination, datasetId, null, apmTransaction)
  }
  apmTransaction.end()
}
