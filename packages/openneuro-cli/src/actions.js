import inquirer from 'inquirer'

const loginQuestions = {
  type: 'input',
  name: 'apikey',
  message:
    'Enter your API key for OpenNeuro (get an API key from https://openneuro.org/user/key)',
}

/**
 * Login action to save an auth key locally
 *
 * The user can do this manually as well, to allow for automation
 * this is a prompted entry
 */
export const login = () => {
  inquirer.prompt(loginQuestions).then(answers => {
    console.log(answers)
  })
}

export const upload = () => {}
