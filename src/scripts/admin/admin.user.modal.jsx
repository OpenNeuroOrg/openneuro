// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import adminStore from './admin.store';
import actions    from './admin.actions';
import Input      from '../common/forms/input.jsx';
import WarnButton from '../common/forms/warn-button.jsx';
import {Modal}    from 'react-bootstrap';

let UserModal = React.createClass({

	mixins: [Reflux.connect(adminStore)],

// life cycle events --------------------------------------------------

	render() {
		let newUser = this.state.newUserForm;

		return (
			<Modal show={this.state.showUserModal} onHide={this._hide}>
            	<Modal.Header closeButton>
            		<Modal.Title>Add User</Modal.Title>
            	</Modal.Header>
            	<hr className="modal-inner" />
            	<Modal.Body>
            		<div>
						{this._newUserError()}
						<Input placeholder="gmail address" type="text"  value={newUser._id}       name={'_id'}       onChange={this._inputChange} />
						<Input placeholder="first name"    type="text"  value={newUser.firstname} name={'firstname'} onChange={this._inputChange} />
						<Input placeholder="last name"     type="text"  value={newUser.lastname}  name={'lastname'}  onChange={this._inputChange} />
			    		<button className="btn-blue" onClick={actions.addUser} >
							<span>Add User</span>
						</button>
					</div>
            	</Modal.Body>
            </Modal>
    	);
	},

// custom methods -----------------------------------------------------

	_newUserError() {
		return this.state.newUserError ? <div className="alert alert-danger">{this.state.newUserError}</div> : null;
	},

	_inputChange (e) {actions.inputChange('newUserForm', e.target.name, e.target.value);},

	_hide() {
		actions.update({showUserModal: false});
	},

});

export default UserModal;