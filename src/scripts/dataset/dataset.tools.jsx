// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions.js';
import WarnButton   from '../common/forms/warn-button.jsx';
import Share        from './dataset.tools.share.jsx';
import Jobs         from './dataset.tools.jobs.jsx';
import {Modal}      from 'react-bootstrap';

let Tools = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentDidMount() {
		if (this.props.canEdit) {
			actions.loadUsers();
		}
	},

	render() {
		let dataset = this.state.dataset;
		let users   = this.props.users;
		let publish, del, share, shareModal, jobs, jobModal;

		if (!dataset.status.uploadIncomplete && this.props.canEdit) {
			publish = (
				<div role="presentation" className="tool" >
					<WarnButton message="Make Dataset Public" confirm="Yes Make Public" icon="fa-globe" action={this._publish.bind(this, dataset._id)} />
	            </div>
			);
		}

		if (this.props.canEdit) {

			del = (
				<div role="presentation" className="tool" >
	            	<WarnButton message="Delete Dataset" action={this._deleteDataset.bind(this, dataset._id)} />
	            </div>
			);

			share = (
	            <div role="presentation" className="tool" >
	            	<button className="btn btn-admin warning"  onClick={actions.toggleModal.bind(null, 'Share')}><i className="fa fa-user-plus"></i> Share Dataset</button>
	            </div>
	        );

			shareModal = (
	            <Modal show={this.state.showShareModal} onHide={actions.toggleModal.bind(null, 'Share')}>
	            	<Modal.Header closeButton>
	            		<Modal.Title>Share Dataset</Modal.Title>
	            	</Modal.Header>
	            	<hr className="modal-inner" />
	            	<Modal.Body>
	            		<Share dataset={dataset} users={users} />
	            	</Modal.Body>
	            </Modal>
	        );

	        jobs = (
	        	<div role="presentation" className="tool" >
	            	<button className="btn btn-admin warning"  onClick={actions.toggleModal.bind(null, 'Jobs')}><i className="fa fa-tasks"></i> Run Analysis</button>
	            </div>
        	);

        	jobModal = (
        		<Modal show={this.state.showJobsModal} onHide={actions.toggleModal.bind(null, 'Jobs')}>
        			<Modal.Header closeButton>
        				<Modal.Title>Run Analysis</Modal.Title>
        			</Modal.Header>
        			<hr className="modal-inner" />
        			<Modal.Body>
        				<Jobs dataset={dataset} apps={this.state.apps} />
        			</Modal.Body>
        		</Modal>
    		);
		}

		return (
			<div className="tools clearfix">
				<div role="presentation" className="tool">
					<button className="btn btn-admin warning" onClick={this._downloadDataset}><i className="fa fa-download"></i> Download Dataset</button>
				</div>
				{publish}
				{del}
				{share}
				{shareModal}
				{jobs}
				{jobModal}
	        </div>
    	);
	},

// custon methods -----------------------------------------------------

	_publish: actions.publish,

	_deleteDataset: actions.deleteDataset,

	_downloadDataset: actions.downloadDataset

});

export default Tools;