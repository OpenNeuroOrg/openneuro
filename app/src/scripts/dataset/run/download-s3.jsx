import React from 'react'
import config from '../../../../config'
import { Modal, Well } from 'react-bootstrap'

class DownloadS3 extends React.Component {
  constructor(props) {
    super(props)
    this.state = { instructionModal: false }
  }

  _s3Url() {
    const bucket = config.aws.s3.analysisBucket
    return (
      's3://' +
      bucket +
      '/' +
      this.props.datasetHash +
      '/' +
      this.props.analysisId
    )
  }

  _openModal(event) {
    event.preventDefault()
    this.setState({ instructionModal: true })
  }

  _closeModal(event) {
    this.setState({ instructionModal: false })
  }

  render() {
    const url = this._s3Url()
    return (
      <span>
        <a
          className="btn-warn-component s3-link"
          href={url}
          onClick={this._openModal.bind(this)}>
          <i className="fa fa-link" aria-hidden="true" /> S3 URL
        </a>
        <Modal
          show={this.state.instructionModal}
          onHide={this._closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Download results from S3</Modal.Title>
            Results are available to download directly from S3.
          </Modal.Header>
          <hr className="modal-inner" />
          <Modal.Body>
            Example download with{' '}
            <a
              href="http://docs.aws.amazon.com/cli/latest/userguide/installing.html"
              target="_blank">
              awscli
            </a>:
            <Well bsSize="small">
              aws s3 sync {url} <strong>destination-directory</strong>
            </Well>
          </Modal.Body>
        </Modal>
      </span>
    )
  }
}

export default DownloadS3
