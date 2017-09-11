# CRN APP

## Usage

__Requirements:__

Node `v6.11.2 (LTS)`
Yarn
gulp-cli (`yarn install -g gulp-cli`)

__Configure:__

Copy or move `config.example` to `config.js` and replace the values with your own. If you prefer to use environment variables in production you can set the values in config.js equal to process.env.YOUR_VARIABLE_NAME and running gulp build will attempt to replace those based on your current environment.

__Install the dependencies:__

run `yarn install`

__Development mode with livereload:__

run `yarn start`

__When you are done, create a production ready version of the JS bundle:__

run `yarn build`


__To run the linting command:__

run `yarn run lint path/to/file`

__To run the scss linting command:__

install `gem install scss_lint`

run `scss-lint path/to/file`