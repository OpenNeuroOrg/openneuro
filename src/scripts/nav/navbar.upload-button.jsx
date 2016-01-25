// dependencies ------------------------------------------------------------------

import React       		from 'react';
import Reflux      		from 'reflux';
import {Link}      		from 'react-router';
import Actions     		from '../upload/upload.actions.js';
import uploadStore 		from '../upload/upload.store.js';
import Upload       	from '../upload/upload.jsx';
import Alert            from '../upload/upload.alert.jsx';
import {ProgressBar,
		Modal} 			from 'react-bootstrap';

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
				<button className="btn btn-blue btn-view-progress"  onClick={Actions.toggleModal}>view progress</button>
				<ProgressBar active now={progress} />
			</div>
		)

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
				{uploadStore.data.uploadStatus == 'uploading' ? progress : uploadBtn}
				{this.state.alert ? <Alert type={this.state.alert} message={this.state.alertMessage} onClose={Actions.closeAlert} /> : null}
				{uploadModal}
				</div>
			</span>
	    );

	},

// custom methods ----------------------------------------------------------------

});



export default UploadBtn;
