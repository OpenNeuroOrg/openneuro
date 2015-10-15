// dependencies -------------------------------------------------------

import React      from 'react';
import Actions    from './user.actions.js';
import userStore  from './user.store.js';
import Input      from '../common/forms/input.jsx';
import {Panel}    from 'react-bootstrap';
import scitran    from '../utils/scitran';
import WarnButton from '../common/forms/warn-button.jsx';

export default class AddUser extends React.Component {

	constructor() {
		super();
		this.state = {
			users: [],
			showDeleteBtn: false,
			newUser: {
				_id: '',
				firstname: '',
				lastname: ''
			},
			newUserError: ''
		};
	}

// life cycle events --------------------------------------------------

	componentDidMount () {
		scitran.getUsers((err, res) => {
			this.setState({users: res.body});
		});
	}

	render () {
		let showDeleteBtn = this.state.showDeleteBtn;
		let users = this.state.users.map((user, index) => {

	        let userName = (
				<div className="userName">
					<span>{user.firstname}</span> &nbsp;
					<span>{user.lastname}</span>
					<div className="badge">{user.wheel === true ? 'Admin' : null }</div>
				</div>
	        );

	        let adminToggle;
	        if (user._id !== userStore.data.scitran._id) {
	        	adminToggle = <WarnButton message="Toggle Admin Privileges" confirm="Toggle Admin" icon="fa-user-plus" action={this._toggleSuperUser.bind(this, user)}/>;
	        }

			return (

			    <div className="fadeIn user-panel clearfix" key={user._id}>
                    <div className="col-sm-4 user-col">
                    	<h3>{userName}</h3>
                    </div>
                    <div className="col-sm-4 user-col middle">
	                    <h3 className="user-email">{user._id}</h3>
                    </div>
                    <div className="col-sm-4 user-col last">
	                    <h3 className="user-delete">
		                    <WarnButton message="Delete this User" action={this._removeUser.bind(this, user._id, index)}/>
		                    {adminToggle}
	                    </h3>
                    </div>
                </div>
			);
		});

		return (
			<div className="fadeIn inner-route admin clearfix">
				<h2>Add A New User</h2>
				<div>
					<div className="col-sm-4 add-user">
						<div>
							{this.state.newUserError ? <div className="alert alert-danger">{this.state.newUserError}</div> : null}
							<Input placeholder="gmail address" type='email' required value={this.state.newUser._id} name={'_id'}       onChange={this._inputChange.bind(this)} />
							<Input placeholder="first name"    type="text" value={this.state.newUser.firstname}     name={'firstname'} onChange={this._inputChange.bind(this)} />
							<Input placeholder="last name"     type="text" value={this.state.newUser.lastname}      name={'lastname'}  onChange={this._inputChange.bind(this)} />
				    		<button className="btn-blue" onClick={this._addUser.bind(this)} >
								<span>Add User</span>
							</button>
						</div>
					</div>
					<div className="col-sm-8 users-card">
					<h2>Current users</h2>
						{users}
					</div>
				</div>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

	/**
	 * Add User
	 *
	 * Takes a gmail address and a first and last
	 * name and adds the user as a user.
	 */
	_addUser () {
		let self = this;
		if (!this.state.newUser._id || !this.state.newUser.firstname || !this.state.newUser.lastname) {
			this.setState({newUserError: 'Email address, first name and last name are required.'});
		} else {
			this.setState({newUserError: ''});
			scitran.addUser(this.state.newUser, function (err, res) {
				let users = self.state.users;
				users.push(self.state.newUser);
				self.setState({users: users, newUser: {_id: '', firstname: '', lastname: ''}});
			});
		}
	}

	/**
	 * Remove User
	 *
	 * Takes a userId and removes the user.
	 */
	_removeUser (userId, index) {
		let self = this;
		scitran.removeUser(userId, function (err, res) {
			let users = self.state.users;
			users.splice(index, 1);
			self.setState({users: users});
		});
	}

	_inputChange (e) {
		let newUser = this.state.newUser;
		newUser[e.target.name] = e.target.value;
		this.setState({newUser: newUser});
	}

	_toggleSuperUser (user, callback) {
		scitran.updateUser(user._id, {wheel: !user.wheel}, (err, res) => {
			let users = this.state.users;
			for (let existingUser of this.state.users) {
				if (existingUser._id === user._id) {
					user.wheel = !user.wheel;
				}
			}
			this.setState({users: users});
			callback();
		});
	}

}