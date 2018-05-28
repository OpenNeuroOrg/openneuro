import React from 'react'
import Input from '../common/forms/input.jsx'
import UploaderContext from './uploader-context.js'

const UploadRename = () => (
  <UploaderContext.Consumer>
    {uploader => (
      <div>
        <span className="message fade-in">Rename your dataset (optional)</span>
        <div className="dir-name has-input clearfix fade-in">
          <label className="add-name">
            <i className="folderIcon fa fa-folder-open" />
          </label>
          <Input
            type="text"
            placeholder="dataset name"
            initialValue={uploader.name}
            onChange={uploader.setName}
          />
        </div>
        <br />
        <button
          className="btn-blue"
          disabled={false}
          onClick={uploader.validate}>
          Continue
        </button>
      </div>
    )}
  </UploaderContext.Consumer>
)

export default UploadRename
