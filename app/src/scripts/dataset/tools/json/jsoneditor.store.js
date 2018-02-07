import Reflux from 'reflux'
import Actions from './jsoneditor.actions.js'

let JsonEditorStore = Reflux.createStore({
  listenables: Actions,

  init() {
    this.setInitialState()
  },

  getInitialState() {
    return this.data
  },

  data: {},

  update: function(data, callback) {
    for (let prop in data) {
      this.data[prop] = data[prop]
    }
    this.trigger(this.data, callback)
  },

  /**
   * Set Initial State
   *
   * Sets the state to the data object defined
   * inside the function. Also takes a diffs object
   * which will set the state to the initial state
   * with any differences passed.
   */
  setInitialState: function(diffs) {
    let data = {
      originalFile: null,
      originalData: null,
      data: null,
      activeSchema: null,
      file: null,
      ready: false,
      editing: false,
      onChange: null,
      onError: null,
      onSubmit: null,
      errorMessage: null,
      errorDetail: null,
      showErrorDetail: false,
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // Actions ---------------------------------------------------------------------------

  // JsonEditor ---------------------------------------------------------------------------

  onChange: function(e) {
    let data = e.target.value
    this.update({ data: data })
  },

  startEdit: function() {
    this.update({ editing: true })
  },

  cancelEdit: function() {
    this.setJsonContent(this.data.originalData)
    this.update({
      editing: false,
      errorMessage: null,
      errorDetail: null,
      showErrorDetail: false,
    })
  },

  toggleInfoDiv: function() {
    this.update({ showErrorDetail: !this.data.showErrorDetail })
  },

  saveFile: async function() {
    let jsonContent
    try {
      jsonContent = JSON.stringify(JSON.parse(this.data.data), null, '\t')
      const fileName = this.data.originalFile.name

      // make url match webkitURL for dataset_description.json
      if (
        fileName === 'dataset_description.json' &&
        this.data.originalFile.parentId === 'root'
      ) {
        let originalFile = this.data.originalFile
        originalFile.relativePath = '/' + fileName
        this.update({ originalFile })
      }

      const validate = await import('bids-validator')
      // apply custom validation agains bids schemas, if relevant
      validate.JSON(this.data.originalFile, jsonContent, issues => {
        if (issues.length) {
          let errors = []
          for (let issue of issues) {
            errors.push(issue.evidence)
          }
          let errorMessage =
            'The data you provided has failed against the bids validation schema.'
          this.update({ errorDetail: errors, errorMessage: errorMessage })
        } else {
          let file = new File([jsonContent], fileName, {
            type: 'application/json',
          })
          file.parentId = this.data.originalFile.parentId

          this.data.onSave(this.data.originalFile, file)

          this.update({ error: null, data: jsonContent })
        }
      })
    } catch (e) {
      let errorMessage = 'The data you have entered is not valid JSON.'
      this.update({ errorDetail: [e.message], errorMessage: errorMessage })
    }
  },

  setJsonContent: function(content) {
    let jsonContent
    try {
      jsonContent = JSON.stringify(JSON.parse(content), null, '\t')
    } catch (e) {
      jsonContent = content
    }
    this.update({ data: jsonContent })
  },
})

export default JsonEditorStore
