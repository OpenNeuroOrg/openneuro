import fs from 'fs'
import inquirer from 'inquirer'
import createClient from 'openneuro-client'
import { files } from 'openneuro-client'
import { saveConfig } from './config'
import { validateAndUpload } from './upload'

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
    if (cmd.dataset) console.log(`Updating ${cmd.dataset}`)
    const client = createClient('http://localhost:9876/graphql')
    return validateAndUpload(client, dir, cmd.datasetId)
  } catch (e) {
    console.error(`"${dir}" does not exist or is not a directory`)
    process.exit(1)
  }
}
