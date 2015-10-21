// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import userStore  from '../user/user.store';
import adminStore from './admin.store';
import actions    from './admin.actions'
import Input      from '../common/forms/input.jsx';
import scitran    from '../utils/scitran';
import WarnButton from '../common/forms/warn-button.jsx';
import {Panel}    from 'react-bootstrap';

let users = React.createClass({

	mixins: [Reflux.connect(adminStore)],

// life cycle events --------------------------------------------------

	componentDidMount () {
		actions.getUsers();
		actions.clearForm('newUserForm');
	},

	render () {
		let newUser = this.state.newUserForm;

		let users = this.state.users.map((user, index) => {
			let adminBadge = user.wheel === true ? 'Admin' : null;

			return (
			    <div className="fadeIn user-panel clearfix" key={user._id}>
                    <div className="col-sm-4 user-col">
                    	<h3>
                    		<div className="userName">
								<span>{user.firstname}</span> &nbsp;
								<span>{user.lastname}</span>
								<div className="badge">{adminBadge}</div>
							</div>
                    	</h3>
                    </div>
                    <div className="col-sm-4 user-col middle">
	                    <h3 className="user-email">{user._id}</h3>
                    </div>
                    {this._userTools(user, index)}
                </div>
			);
		});

		return (
			<div className="dash-tab-content fadeIn inner-route admin clearfix">
				<h2>Current Users</h2>
				<div>
					<div className="col-sm-4 add-user">
						<div>
				    		<button className="btn-blue" onClick={this._userModal} >
								<span>Add User</span>
							</button>
						</div>
					</div>
					<div className="col-sm-8 users-card">
						{users}
					</div>
				</div>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_userTools(user, index) {
		if (user._id !== userStore.data.scitran._id) {
			return (
				<div className="col-sm-4 user-col last">
	                <h3 className="user-delete">
	                    <WarnButton message="Delete this User" action={this._removeUser.bind(this, user._id, index)}/>
	                    <WarnButton message="Toggle Admin Privileges" confirm="Toggle Admin" icon="fa-user-plus" action={actions.toggleSuperUser.bind(this, user)}/>
	                    <button onClick={actions.blacklistModal.bind(this, user)}>Block User</button>
	                </h3>
	            </div>
            );
		}
	},

	_removeUser(userId, index) {
		actions.removeUser(userId, index);
	},

	_newUserError() {
		return this.state.newUserError ? <div className="alert alert-danger">{this.state.newUserError}</div> : null;
	},

	_inputChange(e) {actions.inputChange('newUserForm', e.target.name, e.target.value);},

	_userModal() {
		actions.update({showUserModal: true});
	}

});

export default users;