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
            <div>
                <button className="btn btn-blue btn-view-progress"  onClick={Actions.toggleModal}>view details</button>
                <ProgressBar active now={progress} />
            </div>
        );

        let uploadBtn = (
            <div>
                <button className="btn btn-blue"  onClick={Actions.toggleModal}>Upload Dataset</button>
            </div>
        );

        let uploadModal = (
            <Modal show={this.state.showModal} onHide={Actions.toggleModal} className="upload-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Upload Dataset</Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    <div className="tasks-col fadeIn"><Upload /></div>
                </Modal.Body>
            </Modal>
        );

        return (
            <span>
                <div className="upload-btn-wrap">
                {this.state.uploadStatus == 'uploading' ? progress : uploadBtn}
                {uploadModal}
                <img src="/favicon-upload.png" id="favicon_upload" className="hidden"/>
                </div>
            </span>
        );

    }

});

export default UploadBtn;
