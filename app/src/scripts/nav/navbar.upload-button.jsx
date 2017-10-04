// dependencies ------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import Actions from '../upload/upload.actions.js'
import UploadStore from '../upload/upload.store.js'
import Upload from '../upload/upload.jsx'
import { Modal } from 'react-bootstrap'
import Progress from '../upload/upload.progress.jsx'
import { refluxConnect } from '../utils/reflux'

import favicon_upload from './assets/favicon-upload.png'

// component setup ---------------------------------------------------------------

class UploadBtn extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, UploadStore, 'upload')
  }

  // life cycle methods ------------------------------------------------------------

  render() {
    let progress = (
      <a
        className="nav-link nl-upload nl-progress"
        onClick={Actions.toggleModal}>
        <span className="link-name">view details</span>
        <Progress progress={this.state.upload.progress} minimal={true} />
      </a>
    )

    let uploadBtn = (
      <a className="nav-link nl-upload" onClick={Actions.toggleModal}>
        <span className="link-name">
          <i className="fa fa-upload" /> Upload Dataset
        </span>
      </a>
    )

    let uploadModal = (
      <Modal
        show={this.state.upload.showModal}
        onHide={Actions.toggleModal}
        className="upload-modal">
        <Modal.Header closeButton>
          <Modal.Title>Upload Dataset</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="tasks-col fade-in">
            <Upload />
          </div>
        </Modal.Body>
      </Modal>
    )

    return (
      <span className="upload-btn-wrap">
        {this.state.upload.uploadStatus == 'uploading' ? progress : uploadBtn}
        {uploadModal}
        <img src={favicon_upload} id="favicon_upload" className="hidden" />
      </span>
    )
  }
}

export default UploadBtn
