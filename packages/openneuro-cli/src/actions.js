import fs from 'fs'
import inquirer from 'inquirer'
import createClient from 'openneuro-client'
import { saveConfig, getToken } from './config'
import { validateAndUpload } from './upload'
import { getOrCreateDataset } from './datasets'

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
      name: 'hostname',
      message: 'Choose an OpenNeuro instance to use.',
      choices: ['openneuro.org', 'openneuro.dev.sqm.io'],
      default: 'openneuro.org',
    })
    .then(async answers =>
      Object.assign(
        answers,
        await inquirer.prompt({
          type: 'input',
          name: 'apikey',
          message: `Enter your API key for OpenNeuro (get an API key from https://${
            answers.hostname
          }/keygen)`,
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
  // TODO - This URL (at least the hostname) should be configurable
  const client = createClient('http://localhost:9876/crn/graphql', getToken)
  return getOrCreateDataset(client, dir, datasetId).then(
    validateAndUpload(client, dir, validatorOptions),
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
