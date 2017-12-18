// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../forms/warn-button.jsx'
import Spinner from './spinner.jsx'
import files from '../../utils/files'
import upload from '../../upload/upload'
import async from 'async'
import config from '../../../../config'

let uploadBlacklist = config.upload.blacklist

class FileTree extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    let editable = this.props.editable
    let tree = this.props.tree
    let topLevel = this.props.topLevel

    let nodes = tree.map(item => {
      let name = item.label ? item.label : item.name
      return (
        <li className="clearfix" key={name}>
          <span className="item-name">
            {this._folderIcon(item)} {this._fileLoading(item.loading)}
          </span>
          {this._fileTools(item, editable, topLevel)}
          {this._error(item)}
          {this._children(item, editable)}
        </li>
      )
    })

    return (
      <ul className="top-level-item">
        {this.props.loading ? (
          <Spinner active={true} text="Loading Files" />
        ) : (
          nodes
        )}
      </ul>
    )
  }

  // template methods ---------------------------------------------------

  _children(item, editable) {
    if (item.showChildren) {
      return (
        <ul className="child-files">
          <FileTree
            tree={item.children}
            treeId={this.props.treeId}
            editable={editable}
            dismissError={this.props.dismissError}
            displayFile={this.props.displayFile}
            deleteFile={this.props.deleteFile}
            getFileDownloadTicket={this.props.getFileDownloadTicket}
            toggleFolder={this.props.toggleFolder}
            addFile={this.props.addFile}
            updateFile={this.props.updateFile}
          />
        </ul>
      )
    }
  }

  _error(item) {
    if (item.error) {
      return (
        <div className="message error">
          {item.error + ' '}
          <span onClick={this.props.dismissError.bind(this, item)}>
            <i className="fa fa-times" />
          </span>
        </div>
      )
    }
  }

  _fileLoading(loading) {
    if (loading) {
      return (
        <span className="warning-loading">
          <i className="fa fa-spin fa-circle-o-notch" />
        </span>
      )
    }
  }

  _fileTools(item, editable, topLevel) {
    let deleteFile, editFile, addFile, addDirectory
    if (editable) {
      let inputId = item.hasOwnProperty('_id') ? item._id : item.name
      if (item.children && item.showChildren) {
        addFile = (
          <div className="edit-file">
            <span>
              <i className="fa fa-plus" /> Add File
            </span>
            <input
              type="file"
              className="add-files"
              ref={inputId}
              onChange={this._addFile.bind(this, item)}
              onClick={this._clearInput.bind(this, inputId)}
            />
          </div>
        )
      } else if (!item.children) {
        deleteFile = (
          <span className="delete-file">
            <WarnButton
              icon="fa-trash"
              message="Delete"
              action={this.props.deleteFile.bind(this, item)}
            />
          </span>
        )

        editFile = (
          <div className="edit-file">
            <span>
              <i className="fa fa-file-o" /> Update
            </span>
            <input
              type="file"
              className="update-file"
              ref={inputId}
              onChange={this._updateFile.bind(this, item)}
              onClick={this._clearInput.bind(this, inputId)}
            />
          </div>
        )
      }
      //Adding a multiple file input at the top level of the tree to support adding directories to the dataset
      // this will allow for adding subjects to the dataset
      if (topLevel) {
        addDirectory = (
          <div className="edit-file">
            <span>
              <i className="fa fa-plus" /> Add Directory
            </span>
            <input
              type="file"
              className="add-files"
              ref={inputId}
              onChange={this._addDirectory.bind(this, item)}
              onClick={this._clearInput.bind(this, inputId)}
              webkitdirectory="true"
              directory="true"
            />
          </div>
        )
      }
    }

    let downloadFile
    if (!item.children) {
      downloadFile = (
        <span className="download-file">
          <WarnButton
            icon="fa-download"
            message="Download"
            prepDownload={this.props.getFileDownloadTicket.bind(this, item)}
          />
        </span>
      )
    }

    let displayBtn
    let allowedFiles = [
      '.json',
      '.tsv',
      '.csv',
      'README',
      '.nii.gz',
      '.nii',
      '.pdf',
      '.sh',
      '.py',
      '.txt',
      '.sbatch',
      '.log',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.html',
    ]

    if (
      !item.children &&
      this.props.displayFile &&
      files.hasExtension(item.name, allowedFiles)
    ) {
      if (
        item.name &&
        files.hasExtension(item.name, ['.pdf']) &&
        (item.length > 52428800 || item.size > 52428800)
      ) {
        displayBtn = (
          <span>
            <i className="fa fa-exclamation-triangle color-warning" /> Please
            download to view file.
          </span>
        )
      } else {
        displayBtn = (
          <span className="view-file">
            <WarnButton
              icon="fa-eye"
              warn={false}
              message=" View"
              action={this.props.displayFile.bind(this, item)}
            />
          </span>
        )
      }
    }

    if (addFile || editFile || deleteFile || downloadFile || displayBtn) {
      return (
        <span className="filetree-editfile">
          {addFile}
          {addDirectory}
          {editFile}
          {deleteFile}
          {downloadFile}
          {displayBtn}
        </span>
      )
    } else {
      return false
    }
  }

  _noErrorsInLogs(item) {
    if (item.name === 'errors.txt' && item.length === 0) {
      return (
        <span className="color-green">
          <i className="fa fa-check-circle" /> There are no errors
        </span>
      )
    } else {
      return false
    }
  }

  _folderIcon(item) {
    let label = item.label ? item.label : item.name
    if (item.children) {
      let iconClassAccordion =
        'accordion-icon fa ' +
        (item.showChildren ? 'fa-caret-up' : 'fa-caret-down')
      let iconClass =
        'type-icon fa ' + (item.showChildren ? 'fa-folder-open' : 'fa-folder')
      return (
        <button
          className="btn-file-folder"
          onClick={this.props.toggleFolder.bind(this, item, this.props.treeId)}>
          <i className={iconClass} /> {label}
          <i className={iconClassAccordion} />
        </button>
      )
    } else {
      // remove full file paths
      label = label.split('/')[label.split('/').length - 1]
      return (
        <span>
          {label} {this._noErrorsInLogs(item)}
        </span>
      )
    }
  }

  // custom methods -----------------------------------------------------

  /**
     * Add File
     */
  _addFile(container, event) {
    this.props.addFile(container, event.target.files[0])
  }

  _addDirectory(container, event) {
    event.preventDefault()

    let fileList = event.target.files
    let newFileList = []
    Object.keys(fileList).forEach(key => {
      //filter out any blacklisted files before upload
      if (uploadBlacklist.indexOf(fileList[key].name) === -1) {
        newFileList.push(fileList[key])
      }
    })
    let dirTree = files.generateTree(newFileList)
    let uploads = []
    Object.keys(newFileList).forEach((fileKey, index) => {
      let fileObj = newFileList[fileKey]
      let modifiedContainer = files.findInTree(dirTree, fileObj.parentId)
      uploads.push({ container: modifiedContainer, file: fileObj })
    })
    this.props.addDirectoryFile(uploads, dirTree[0])
  }

  /**
     * Clear Input
     */
  _clearInput(ref) {
    this.refs[ref].value = null
  }

  /**
     * Update File
     */
  _updateFile(item, event) {
    this.props.updateFile(item, event.target.files[0])
  }
}

FileTree.props = {
  editable: false,
  loading: false,
  tree: [],
  treeId: '',
}

FileTree.propTypes = {
  editable: PropTypes.bool,
  loading: PropTypes.bool,
  tree: PropTypes.array,
  treeId: PropTypes.string,
  dismissError: PropTypes.func,
  deleteFile: PropTypes.func,
  getFileDownloadTicket: PropTypes.func,
  toggleFolder: PropTypes.func,
  addFile: PropTypes.func,
  addDirectoryFile: PropTypes.func,
  updateFile: PropTypes.func,
  displayFile: PropTypes.func,
}

export default FileTree
