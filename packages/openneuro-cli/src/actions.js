/* eslint-disable no-console */
import fs from 'fs'
import inquirer from 'inquirer'
import createClient from 'openneuro-client'
import { saveConfig, getToken, getUrl } from './config'
import { validation, uploadDirectory } from './upload'
import { getDatasetFiles, createDataset } from './datasets'
import { getSnapshots } from './snapshots.js'
import { getDownload } from './download.js'

const { version } = require('../package.json')

export const configuredClient = () =>
  createClient(`${getUrl()}crn/graphql`, getToken, null, version)

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
      choices: ['https://openneuro.org/', 'https://openneuro.staging.sqm.io/'],
      default: 'https://openneuro.org/',
    })
    .then(async answers =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: 'input',
          name: 'apikey',
          message: `Enter your API key for OpenNeuro (get an API key from ${answers.url}keygen)`,
        }),
      ),
    )
    .then(loginAnswers)
    .then(saveConfig)
}

/**
 * Handle login answers returned by inquirer
 *
 * @param {Object} answers
 */
export const loginAnswers = answers => answers

const uploadDataset = (dir, datasetId, validatorOptions) => {
  const client = configuredClient()
  if (datasetId) {
    // Check for dataset -> validation -> upload
    // Get remote files and filter successful files out
    return getDatasetFiles(client, datasetId)
      .then(({ data }) =>
        validation(dir, validatorOptions).then(() => data.dataset.draft.files),
      )
      .then(remoteFiles =>
        uploadDirectory(client, dir, {
          datasetId,
          remoteFiles,
          remove: false,
        }),
      )
  } else {
    // Validation -> create dataset -> upload
    return validation(dir, validatorOptions)
      .then(() => createDataset(client, dir))
      .then(dsId => uploadDirectory(client, dir, { datasetId: dsId }))
  }
}

const notifyUploadComplete = update => datasetId => {
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
      verbose: cmd.verbose,
    }
    if (cmd.dataset) {
      // eslint-disable-next-line no-console
      console.log(`Adding files to "${cmd.dataset}"`)
      uploadDataset(dir, cmd.dataset, validatorOptions).then(
        notifyUploadComplete('update'),
      )
    } else {
      inquirer
        .prompt({
          type: 'confirm',
          name: 'yes',
          default: true,
          message: 'This will create a new dataset, continue?',
        })
        .then(({ yes }) => {
          if (yes) {
            return uploadDataset(dir, cmd.dataset, validatorOptions).then(
              notifyUploadComplete(false),
            )
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
  if (!cmd.draft && !cmd.snapshot) {
    const client = configuredClient()
    return getSnapshots(client)(datasetId).then(({ data }) => {
      if (data.dataset && data.dataset.snapshots) {
        const tags = data.dataset.snapshots.map(snap => snap.tag)
        return promptTags(tags).then(choices =>
          getDownload(destination, datasetId, choices.tag),
        )
      }
    })
  } else if (cmd.snapshot) {
    getDownload(destination, datasetId, cmd.snapshot)
  } else {
    getDownload(destination, datasetId)
  }
}
