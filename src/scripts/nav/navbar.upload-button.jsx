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

        // resume
        let rCompleted = this.state.resumeProgress.completed;
        let rTotal     = this.state.resumeProgress.total;
        let rProgress  = rTotal > 0 ? Math.floor(rCompleted / rTotal * 100) : 0;

        // upload
        let uCompleted = this.state.progress.completed;
        let uTotal     = this.state.progress.total;
        if (this.state.resumeStart) {
            let resumeStart = this.state.resumeStart;
            rProgress = rProgress * (resumeStart / uTotal);
            uCompleted = uCompleted - resumeStart;
            uTotal     = uTotal - resumeStart;
        }
        let uProgress  = uTotal > 0 ? Math.floor(uCompleted / uTotal * 100) : 0;



        let progress = (
            <a className="nav-link nl-upload nl-progress"  onClick={Actions.toggleModal}>
                <span className="link-name">view details</span>
                <ProgressBar>
                    <ProgressBar active bsStyle="warning" now={rProgress} key={1} />
                    <ProgressBar active bsStyle="success" now={uProgress} key={2}/>
                </ProgressBar>
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