// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import adminStore from './admin.store';
import actions    from './admin.actions';
import Input      from '../common/forms/input.jsx';
import WarnButton from '../common/forms/warn-button.jsx';
import {Modal}    from 'react-bootstrap';

let BlacklistModal = React.createClass({

	mixins: [Reflux.connect(adminStore)],

// life cycle events --------------------------------------------------

	render() {
		let blacklistForm = this.state.blacklistForm;

		return (
			<Modal show={this.state.showBlacklistModal} onHide={this._hide}>
            	<Modal.Header closeButton>
            		<Modal.Title>Block a User</Modal.Title>
            	</Modal.Header>
            	<hr className="modal-inner" />
            	<Modal.Body>
            		<div className="blacklist-modal">
						{this._blacklistError()}
						<Input placeholder="Gmail Address" type="text"  value={blacklistForm._id}       name={'_id'}       onChange={this._inputChange} />
						<Input placeholder="First Name"    type="text"  value={blacklistForm.firstname} name={'firstname'} onChange={this._inputChange} />
						<Input placeholder="Last Name"     type="text"  value={blacklistForm.lastname}  name={'lastname'}  onChange={this._inputChange} />
						<Input placeholder="Note"          type="textarea"  value={blacklistForm.note}      name={'note'}      onChange={this._inputChange} />
			    		<button className="btn-admin-blue" onClick={actions.blacklistSubmit} >
							<span>Block</span>
						</button>
					</div>
            	</Modal.Body>
            </Modal>
    	);
	},

// custom methods -----------------------------------------------------

	_blacklistError() {
		return this.state.blacklistError ? <div className="alert alert-danger">{this.state.blacklistError}</div> : null;
	},

	_inputChange (e) {actions.inputChange('blacklistForm', e.target.name, e.target.value);},

	_hide() {
		actions.update({showBlacklistModal: false});
	},

});

export default BlacklistModal;