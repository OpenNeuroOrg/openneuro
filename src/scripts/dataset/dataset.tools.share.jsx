// dependencies -------------------------------------------------------

import React     from 'react';
import Actions   from './dataset.actions.js';
import bids      from '../utils/bids';
import scitran   from '../utils/scitran';
import Typeahead from '../common/forms/typeahead.jsx';

export default class Share extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			edit: true,
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

		let permissions = this.state.permissions.map((user) => {
			return (
				<div key={user._id}>{user._id} <span>{user.access}</span>
					<button onClick={this._removeUser.bind(this, user._id)}>x</button>
				</div>
			);
		});

		return (
			<div>
				<div>Members</div>
				{permissions}
				<div>Add Member</div>
				<div>
					<Typeahead options={this.state.users} filter={this._filter} format={'_id'} onChange={this._typeaheadChange.bind(this)} value={this.state.input}/>
					<select onChange={this._selectChange.bind(this)} value={this.state.select}>
						<option value="" disabled>access level</option>
						<option value="ro">Read only</option>
						<option value="rw">Read write</option>
						<option value="admin">Admin</option>
					</select>
					<button onClick={this._addUser.bind(this)}>add</button>
				</div>
			</div>
    	);
	}

// custon methods -----------------------------------------------------

	_toggleEdit() {
		this.setState({edit: !this.state.edit});
	}

	_filter(option, value) {
		if (option._id.indexOf(value) > -1) {
			return true;
		} else if (option.firstname.indexOf(value) > -1) {
			return true;
		} else if (option.lastname.indexOf(value) > -1) {
			return true;
		}
		return false;
	}

	_typeaheadChange (input) {
		this.setState({input});
	}

	_selectChange (e) {
		let select = e.target.value;
		this.setState({select});
	}

	_addUser() {
		if (this.state.input.length < 1 || this.state.select.length < 1) {
			// please enter an email and access level
			return;
		}
		let role = {
			_id: this.state.input,
			access: this.state.select
		};
		bids.addPermission(this.props.dataset._id, role, (err, res) => {
			let permissions = this.state.permissions;
			permissions.push(role);
			this.setState({input: '', select: '', permissions: permissions});
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