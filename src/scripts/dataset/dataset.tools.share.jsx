// dependencies -------------------------------------------------------

import React     from 'react';
import Actions   from './dataset.actions.js';
import bids      from '../utils/bids';
import scitran   from '../utils/scitran';
import Input     from '../common/forms/input.component.jsx';

export default class Share extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			edit: true,
			error: null,
			users: [],
			permissions: [],
			input: '',
			select: ''
		};
	}

	componentDidMount() {
		this.setState({users: this.props.users, permissions: this.props.dataset.permissions});
	}

	render() {

		let accessKey = {
			admin: 'Administrator',
			rw: 'Can edit',
			ro: 'Can view'
		};

		let permissions = this.state.permissions.map((user) => {
			return (
				<div key={user._id} className="cte-array-item">{user._id} <span>- {accessKey[user.access]}</span>
					<button className="cte-remove-button btn btn-admin warning" onClick={this._removeUser.bind(this, user._id)}>
						<i className="fa fa-times"></i>
					</button>
				</div>
			);
		});

		return (
			<div className="dataset">
				<h5>Members</h5>
				<div className="cte-array-items">
					{permissions}
				</div>
				<h5 className="add-members">Shared With</h5>
				<div>
					<div className="text-danger">{this.state.error}</div>
					<Input value={this.state.input} onChange={this._inputChange.bind(this)} placeholder="user email" />
					<select className="selectBox-style" onChange={this._selectChange.bind(this)} value={this.state.select}>
						<option value="" disabled>access level</option>
						<option value="ro">Can view</option>
						<option value="rw">Can edit</option>
						<option value="admin">Administrator</option>
					</select>
					<span className="caret-down"></span>
					<button className="btn-admin admin-blue" onClick={this._addUser.bind(this)}>add</button>
				</div>
			</div>
    	);
	}

// custon methods -----------------------------------------------------

	_toggleEdit() {
		this.setState({edit: !this.state.edit});
	}

	_inputChange (e) {
		this.setState({input: e.target.value});
	}

	_selectChange (e) {
		let select = e.target.value;
		this.setState({select});
	}

	_addUser() {
		this.setState({error: null});

		// check name and access level are selected
		if (this.state.input.length < 1 || this.state.select.length < 1) {
			this.setState({error: 'You must enter an email address and select an access level.'});
			return;
		}

		// check if user is already a member
		let isMember = false;
		for (let user of this.state.permissions) {
			if (this.state.input === user._id) {isMember = true};
		}
		if (isMember) {
			this.setState({error: 'That user is already a member of this dataset.'});
		}

		// check if user exists
		let userExists = false;
		for (let user of this.state.users) {
			if (this.state.input === user._id) {userExists = true;}
		}
		if (!userExists) {
			this.setState({error: 'A user does not exist with that email. Make sure you are entering the full email address of another user.'});
			return;
		}

		// add member
		let role = {
			_id: this.state.input,
			access: this.state.select
		};
		bids.addPermission(this.props.dataset._id, role, (err, res) => {
			let permissions = this.state.permissions;
			permissions.push(role);
			this.setState({input: '', select: '', permissions: permissions, error: null});
		});
	}

	_removeUser(userId) {
		bids.removePermission(this.props.dataset._id, userId, (err, res) => {
			let index;
			let permissions = this.state.permissions;
			for (let i = 0; i < permissions.length; i++) {
				if (permissions[i]._id === userId) {index = i;}
			}
			permissions.splice(index, 1);
			this.setState({permissions});
		});
	}

}