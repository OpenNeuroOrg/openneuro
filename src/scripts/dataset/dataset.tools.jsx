// dependencies -------------------------------------------------------

import React        								from 'react';
import Reflux       								from 'reflux';
import datasetStore 								from './dataset.store';
import actions      								from './dataset.actions.js';
import WarnButton   								from '../common/forms/warn-button.jsx';
import WarnButtonWithTip   							from '../common/forms/warn-button-withtip.jsx';
import Share        								from './dataset.tools.share.jsx';
import Jobs         								from './dataset.tools.jobs.jsx';
import {OverlayTrigger, Tooltip, Modal}      		from 'react-bootstrap';

let Tools = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentDidMount() {
		let dataset = this.state.dataset;
		if (dataset && (dataset.access === 'rw' || dataset.access == 'admin')) {
			actions.loadUsers();
		}
	},

	render() {
		let dataset = this.state.dataset;
		let users   = this.state.users;
		let publish, del, share, shareModal, jobs, jobModal, snapshot;
		let tooltipShare = <Tooltip>Share Dataset</Tooltip>;
		let tooltipJobs = <Tooltip>Run Analysis</Tooltip>;
		let tooltipDownload = <Tooltip>Download Dataset</Tooltip>;
		let snapshots = this.state.snapshots;

		if (dataset.access === 'admin') {
			if (!dataset.public) {
				del = (
					<div role="presentation" className="tool" >
		            		<WarnButtonWithTip message="" confirm="" tooltip="Delete Dataset" icon="fa-trash" action={this._deleteDataset.bind(this, dataset._id)} />
		            </div>
				);
			}

			if (!dataset.status.uploadIncomplete && !dataset.public) {
				publish = (
					<div role="presentation" className="tool" >
						<WarnButtonWithTip message="" confirm="" tooltip="Make Dataset Public" icon="fa-globe" action={this._publish.bind(this, dataset._id)} />
		            </div>
				);

				snapshot = (
					<div role="presentation" className="tool" >
						<WarnButtonWithTip message="" confirm="" tooltip="Snapshot Dataset" icon="fa-camera-retro" action={this._snapshot.bind(this, dataset._id)} />
		            </div>
				);
			}

			share = (
	            <div role="presentation" className="tool" >
	            	<OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltipShare}>
	            		<button className="btn btn-admin warning"  onClick={actions.toggleModal.bind(null, 'Share')}><i className="fa fa-user-plus"></i></button>
	            	</OverlayTrigger>
	            </div>
	        );

			shareModal = (
	            <Modal show={this.state.showShareModal} onHide={actions.toggleModal.bind(null, 'Share')} className="share-modal">
	            	<Modal.Header closeButton>
	            		<Modal.Title>Share Dataset</Modal.Title>
	            	</Modal.Header>
	            	<hr className="modal-inner" />
	            	<Modal.Body>
	            		<Share dataset={dataset} users={users} />
	            	</Modal.Body>
	            </Modal>
	        );
		}

		if (dataset && (dataset.access === 'rw' || dataset.access == 'admin') && !dataset.public) {
	        jobs = (
	        	<div role="presentation" className="tool" >
	            	<OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltipJobs}>
	            		<button className="btn btn-admin warning"  onClick={actions.toggleModal.bind(null, 'Jobs')}><i className="fa fa-tasks"></i></button>
	            	</OverlayTrigger>
	            </div>
        	);

        	jobModal = (
        		<Modal show={this.state.showJobsModal} onHide={actions.toggleModal.bind(null, 'Jobs')}>
        			<Modal.Header closeButton>
        				<Modal.Title>Run Analysis</Modal.Title>
        			</Modal.Header>
        			<hr className="modal-inner" />
        			<Modal.Body>
        				<Jobs dataset={dataset} apps={this.state.apps} loadingApps={this.state.loadingApps} />
        			</Modal.Body>
        		</Modal>
    		);
		}

		let snapshotOptions = snapshots.map((snapshot) => {
			return <option key={snapshot._id} value={snapshot._id}>{snapshot.created}</option>
		})

		return (
			<div className="tools clearfix">
				<div role="presentation" className="tool">
					<OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltipDownload}>
						<button className="btn btn-admin warning" onClick={this._downloadDataset}><i className="fa fa-download"></i></button>
					</OverlayTrigger>
				</div>
				{publish}
				{del}
				{share}
				{shareModal}
				{jobs}
				{jobModal}
				{snapshot}
				<div role="presentation" className="tool" >
					<select onChange={this._selectSnapshot} defaultValue="">
						<option value="" disabled>Select a snapshot</option>
						{snapshotOptions}
					</select>
	            </div>
	        </div>
    	);
	},

// custon methods -----------------------------------------------------

	_snapshot: actions.createSnapshot,

	_selectSnapshot: (e) => {
		actions.loadSnapshot(e.target.value);
	},

	_publish: actions.publish,

	_deleteDataset: actions.deleteDataset,

	_downloadDataset: actions.downloadDataset

});

export default Tools;