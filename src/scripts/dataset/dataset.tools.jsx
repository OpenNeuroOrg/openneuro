// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import Actions      from './dataset.actions.js';
import WarnButton   from '../common/forms/warn-button.jsx';
import Share        from './dataset.tools.share.jsx';
import {Modal}      from 'react-bootstrap';

let Tools = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	getInitialState() {
		return {
			showModal: false
		};
	},

	componentDidMount() {
		if (this.props.canEdit) {
			Actions.loadUsers();
		}
	},

	render() {
		let dataset = this.props.dataset;
		let users   = this.props.users;
		let publish, del, share, shareModal;

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
	            	<button className="btn btn-admin warning"  onClick={this._showModal}><i className="fa fa-user-plus"></i> Share Dataset</button>
	            </div>
	        );

			shareModal = (
	            <Modal show={this.state.showModal} onHide={this._hideModal}>
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

		return (
			<div className="tools clearfix">
				<div role="presentation" className="tool">
					<button className="btn btn-admin warning" onClick={this._downloadDataset}><i className="fa fa-download"></i> Download Dataset</button>
				</div>
				{publish}
				{del}
				{share}
				{shareModal}
	        </div>
    	);
	},

// custon methods -----------------------------------------------------

	_publish: Actions.publish,

	_deleteDataset: Actions.deleteDataset,

	_showModal() {
		this.setState({showModal: true});
	},

	_hideModal() {
		this.setState({showModal: false});
	},

	_downloadDataset: Actions.downloadDataset

});

export default Tools;