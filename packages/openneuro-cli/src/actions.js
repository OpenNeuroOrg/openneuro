import inquirer from 'inquirer'
import { saveConfig } from './config'

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

export const upload = () => {}
