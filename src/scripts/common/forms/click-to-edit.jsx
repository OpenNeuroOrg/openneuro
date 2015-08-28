// dependencies -------------------------------------------------------

import React from 'react';

let ClickToEdit = React.createClass({

	propTypes: {
		type: React.PropTypes.string,
	},

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			type: 'input',
			editable: true
		};
	},

	getInitialState() {
		return {
			value: this.props.value ? this.props.value : '',
			initialValue: this.props.value ? this.props.value : ''
		}
	},

	render() {
		let value = this.state.value;

		let input;
		switch (this.props.type) {
			case "input":
				input = <input value={value} onChange={this._handleChange} />;
				break;
			case "textarea":
				input = <textarea value={value} onChange={this._handleChange}></textarea>;
				break;
			case "array":
				input = <div>array input</div>;
				break;
		}

		let editBtn;
		if (this.props.editable) {
			editBtn = <button onClick={this._edit}>click to edit</button>;
		}

		let display = (
			<div>
				<div>{value}</div>
				{editBtn}
			</div>
		);

		let edit = (
			<div>
				{input}
				<button onClick={this._display}>save</button>
				<button onClick={this._cancel}>cancel</button>
			</div>
		);

		return (
			<div>
				{this.state.edit ? edit : display}
			</div>
    	);
	},

// custon methods -----------------------------------------------------

	_display() {
		this.setState({edit: false});
	},

	_edit() {
		this.setState({edit: true});
	},

	_handleChange(event) {
		this.setState({value: event.target.value});

		if (this.props.onChange) {
			this.props.onChange(event);
		}
	},

	_cancel() {
		this.setState({edit: false, value: this.state.initialValue});
	}

});

export default ClickToEdit;