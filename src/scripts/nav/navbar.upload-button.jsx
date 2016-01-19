// dependencies ------------------------------------------------------------------

import React       		from 'react';
import Reflux      		from 'reflux';
import {Link}      		from 'react-router';
import Actions     		from '../user/user.actions.js';
import userStore   		from '../user/user.store.js';
import uploadStore 		from '../upload/upload.store.js';
import Upload       	from '../upload/upload.jsx';
import Progress       	from '../upload/upload.progress.jsx';
import {CollapsibleNav,
		Nav,
		DropdownButton,
		Modal} 			from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let UploadBtn = React.createClass({

	mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------

	render: function () {

		let uploadBtn = (
			<div>
				<button className="btn btn-blue"  onClick={Actions.toggleModal.bind(null, 'Upload')}>Upload Dataset {uploadStore.data.uploadStatus == 'uploading' ? <Progress /> : null}</button>
			</div>
		);

		let uploadModal = (
            <Modal show={this.state.showUploadModal} onHide={Actions.toggleModal.bind(null, 'Upload')} className="upload-modal">
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
			<div className="upload-modal-wrap">
				{uploadBtn}
				{uploadModal}
			</div>
	    );
	},

// custom methods ----------------------------------------------------------------

});



export default UploadBtn;
