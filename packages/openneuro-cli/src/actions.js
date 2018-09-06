import fs from 'fs'
import inquirer from 'inquirer'
import createClient from 'openneuro-client'
import { saveConfig, getToken, getUrl } from './config'
import { validation, uploadDirectory } from './upload'
import { getDatasetFiles, createDataset } from './datasets'

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
      choices: ['https://openneuro.org/', 'https://openneuro.dev.sqm.io/'],
      default: 'https://openneuro.org/',
    })
    .then(async answers =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: 'input',
          name: 'apikey',
          message: `Enter your API key for OpenNeuro (get an API key from ${
            answers.url
          }keygen)`,
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
  const url = getUrl()
  const client = createClient(`${url}crn/graphql`, getToken)
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
      uploadDataset(dir, cmd.dataset, validatorOptions)
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
            uploadDataset(dir, cmd.dataset, validatorOptions)
          }
        })
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`"${dir}" does not exist or is not a directory`)
    process.exit(1)
  }
}
