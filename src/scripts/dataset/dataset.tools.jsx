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

	render() {
		let dataset = this.props.dataset;
		return (
			<ul className="nav nav-pills tools">
				<li role="presentation" >
					<WarnButton message="Make Public" confirm="Yes Make Public" icon="fa-share" action={this._publish.bind(this, dataset._id)} />
	            </li>
	            <li role="presentation" >
	            	<WarnButton message="Delete this dataset" action={this._deleteDataset.bind(this, dataset._id)} />
	            </li>
	            <li role="presentation" >
	            	<button>share</button>
	            </li>
	            <Modal>
	            	<Modal.Header closeButton>
	            	</Modal.Header>
	            	<Modal.Body>
	            		<Share dataset={dataset} />
	            	</Modal.Body>
	            </Modal>
	        </ul>
    	);
	},

// custon methods -----------------------------------------------------

	_publish: Actions.publish,

	_deleteDataset: Actions.deleteDataset

});

export default Tools;

// <Share dataset={dataset} />