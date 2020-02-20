import fs from 'fs'
import _ from 'underscore'

// set template interpolation wrapper to {{}}
_.templateSettings = {
  evaluate: /\{\{(.+?)\}\}/g,
  interpolate: /\{\{=(.+?)\}\}/g,
  escape: /\{\{-(.+?)\}\}/g,
}

// generate object of template methods
const templates = {}
const files = fs.readdirSync(__dirname)
for (const file of files) {
  if (file.includes('.html')) {
    const tplName = file.slice(0, file.indexOf('.html'))
    const tpl = fs.readFileSync(__dirname + '/' + file).toString('utf-8')
    templates[tplName] = _.template(tpl)
  }
}

export default templates
