// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions.js';
import Spinner from '../common/partials/spinner.jsx';
import {Modal} from 'react-bootstrap';

export default class Publish extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<Modal show={this.props.show} onHide={this._hide.bind(this)}>
    			<Modal.Header closeButton>
    				<Modal.Title>Update</Modal.Title>
    			</Modal.Header>
    			<hr className="modal-inner" />
				<Modal.Body>
	    			{this._body(this.props.update)}
    			</Modal.Body>
    		</Modal>
    	);
	}

// template methods ---------------------------------------------------

	_body(currentUpdate) {
		if (currentUpdate) {
			return (
				<div>
					<div className="dataset">
						Warning you are about to {currentUpdate.message}. This action will run validation again. As a result, your dataset could become invalid, Do you want to continue?
					</div>
					<input type="checkbox" /><label>Do not show me this message again</label>
					<div className="col-xs-12 modal-actions">
						<button className="btn-modal-submit" onClick={this._confirm.bind(this, currentUpdate.action)}>Confirm</button>
						<button className="btn-reset" onClick={this._hide.bind(this)}>Cancel</button>
					</div>
				</div>
			);
		}
	}


// actions ------------------------------------------------------------

	/**
	 * Confirm
	 */
	_confirm(action) {
		action();
		this._hide();
	}

	/**
	 * Hide
	 */
	_hide() {
		this.props.onHide();
	}

}