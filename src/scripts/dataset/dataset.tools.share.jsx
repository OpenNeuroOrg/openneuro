// dependencies -------------------------------------------------------

import React        from 'react';
import Actions      from './dataset.actions.js';

export default class Share extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			edit: false
		};
	}

	render() {
		let dataset = this.props.dataset;

		let permissions = this.props.dataset.permissions.map(function (user) {
			return (
				<div key={user._id}>{user._id} <span>{user.access}</span></div>
			);
		});

		let button;
		let edit;

		if (this.state.edit) {
			button = <button onClick={this._toggleEdit.bind(this)}>done</button>
			edit = (
				<div>
					<input ref="input"/>
					<select ref="select">
						<option value="" selected disabled>select permissions</option>
						<option value="ro">Read only</option>
						<option value="rw">Read write</option>
						<option value="admin">Admin</option>
					</select>
					<button onClick={this._addUser.bind(this)}>add</button>
				</div>
			);
		} else {
			button = <button onClick={this._toggleEdit.bind(this)}>edit</button>
		}

		return (
			<div>
				<div>Members {button}</div>
				{edit}
				{permissions}
			</div>
    	);
	}

// custon methods -----------------------------------------------------

	_toggleEdit() {
		this.setState({edit: !this.state.edit});
	}

	_addUser() {
		let role = {
			_id: this.refs.input.getDOMNode().value,
			access: this.refs.select.getDOMNode().value
		}
		console.log(role);
		this.refs.input.getDOMNode().value = '';
		this.refs.select.getDOMNode().value = '';
	}

}