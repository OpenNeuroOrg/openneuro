// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import Actions      from './dataset.actions.js';
import WarnButton   from '../common/forms/warn-button.component.jsx';
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

	render() {
		let dataset = this.props.dataset;
		let users   = this.props.users;
		return (
			<ul className="nav nav-pills tools clearfix">
				<li role="presentation" >
					<WarnButton message="Make Public" confirm="Yes Make Public" icon="fa-share" action={this._publish.bind(this, dataset._id)} />
	            </li>
	            <li role="presentation" >
	            	<WarnButton message="Delete this dataset" action={this._deleteDataset.bind(this, dataset._id)} />
	            </li>
	            <li role="presentation" >
	            	<button className="btn btn-admin warning"  onClick={this._showModal}>Share <i className="fa fa-users"></i></button>
	            </li>
	            <Modal show={this.state.showModal} onHide={this._hideModal}>
	            	<Modal.Header closeButton>
	            		<Modal.Title>Share Dataset</Modal.Title>
	            	</Modal.Header>
	            	<Modal.Body>
	            		<Share dataset={dataset} users={users} />
	            	</Modal.Body>
	            </Modal>
	        </ul>
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
	}

});

export default Tools;