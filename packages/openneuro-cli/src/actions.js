import fs from 'fs'
import inquirer from 'inquirer'
import createClient from 'openneuro-client'
import { saveConfig } from './config'
import { validateAndUpload } from './upload'
import { getOrCreateDataset } from './datasets'

const loginQuestions = {
  type: 'input',
  name: 'apikey',
  message:
    'Enter your API key for OpenNeuro (get an API key from https://openneuro.org/keygen)',
}

/**
 * Login action to save an auth key locally
 *
 * The user can do this manually as well, to allow for automation
 * this is a prompted entry
 */
export const login = () => {
  return inquirer
    .prompt(loginQuestions)
    .then(loginAnswers)
    .then(saveConfig)
}

/**
 * Handle login answers returned by inquirer
 *
 * @param {Object} answers
 */
export const loginAnswers = answers => answers

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
    // eslint-disable-next-line no-console
    if (cmd.dataset) console.log(`Updating ${cmd.dataset}`)
    // TODO - This URL (at least the hostname) should be configurable
    const client = createClient('http://localhost:9876/crn/graphql')
    return getOrCreateDataset(client, dir, cmd.datasetId).then(
      validateAndUpload(client, dir),
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`"${dir}" does not exist or is not a directory`)
    process.exit(1)
  }
}
