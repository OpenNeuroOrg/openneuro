// dependencies -------------------------------------------------------

import React     from 'react';
import Actions   from './user.actions.js';
import UserStore from './user.store.js';
import Input     from '../common/forms/input.component.jsx';
import scitran   from '../utils/scitran';

export default class AddUser extends React.Component {

	constructor() {
		super();
		this.state = {
			users: [],
			newUser: {
				_id: '',
				firstname: '',
				lastname: ''
			}
		};
	}

// life cycle events --------------------------------------------------

	componentDidMount () {
		let self = this;
		scitran.getUsers(function (err, res) {
			self.setState({users: res.body});
		});
	}

	render () {
		let self = this;
		let users = this.state.users.map(function (user, index) {
			console.log(user)
			return (
				<div key={index}>
					<span>{user._id}</span><button onClick={self._removeUser.bind(self, user._id, index)}>remove</button>
				</div>
			);
		});
		return (
			<div className="signInBlock fadeIn inner-route">
				<h2>Add A New User</h2>
				<Input placeholder="gmail address" type="text" value={this.state.newUser._id}       name={'_id'}       onChange={this._inputChange.bind(this)} />
				<Input placeholder="first name"    type="text" value={this.state.newUser.firstname} name={'firstname'} onChange={this._inputChange.bind(this)} />
				<Input placeholder="last name"     type="text" value={this.state.newUser.lastname}  name={'lastname'}  onChange={this._inputChange.bind(this)} />
	    		<button className="btn-blue" onClick={this._addUser.bind(this)} >
					<span>Add User</span>
				</button>
				{users}
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
		scitran.addUser(this.state.newUser, function (err, res) {
			let users = self.state.users;
			users.push(self.state.newUser);
			self.setState({users: users, newUser: {_id: '', firstname: '', lastname: ''}});
		});
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

}