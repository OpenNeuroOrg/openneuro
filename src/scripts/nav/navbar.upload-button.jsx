// dependencies ------------------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import Actions       from '../upload/upload.actions.js';
import uploadStore   from '../upload/upload.store.js';
import Upload        from '../upload/upload.jsx';
import {ProgressBar,
        Modal}       from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let UploadBtn = React.createClass({

    mixins: [Reflux.connect(uploadStore)],

// life cycle methods ------------------------------------------------------------

    render: function () {
        let completed = this.state.progress.completed;
        let total     = this.state.progress.total;
        let progress  = total > 0 ? Math.floor(completed / total * 100) : 0;

        progress = (
                <a className="nav-link nl-upload nl-progress"  onClick={Actions.toggleModal}>
                    <span className="link-name">view details</span>
                    <ProgressBar active now={progress} />
                </a>
        );

        let uploadBtn = (
                <a className="nav-link nl-upload"  onClick={Actions.toggleModal}><span className="link-name"><i className="fa fa-upload"></i> Upload Dataset</span></a>
        );

        let uploadModal = (
            <Modal show={this.state.showModal} onHide={Actions.toggleModal} className="upload-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Upload Dataset</Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    <div className="tasks-col fade-in"><Upload /></div>
                </Modal.Body>
            </Modal>
        );

        return (
            <span className="upload-btn-wrap">
                {this.state.uploadStatus == 'uploading' ? progress : uploadBtn}
                {uploadModal}
                <img src="/assets/favicon-upload.png" id="favicon_upload" className="hidden"/>
            </span>
        );

    }

});

export default UploadBtn;