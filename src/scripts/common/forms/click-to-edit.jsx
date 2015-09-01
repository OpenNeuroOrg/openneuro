// dependencies -------------------------------------------------------

import React      from 'react';
import ArrayInput from './array-input.jsx';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			editable: true,
			value: ''
		};
	},

	getInitialState() {
		return {value: this.props.value};
	},

	render() {
		let value = this.state.value;

		let input;
		switch (typeof value) {
			case "string":
				input = <textarea value={value} onChange={this._handleChange}></textarea>;
				break;
			case "object":
				input = (
					<div>
						<ArrayInput value={value} />
					</div>
				);
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
				<button onClick={this._save}>save</button>
				<button onClick={this._cancel}>cancel</button>
			</div>
		);

		return (
			<div>
				<label>{this.props.label}</label><br />
				<div>
					{this.state.edit ? edit : display}
				</div>
				<br />
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
	},

	_save() {
		this._display();
		if (this.props.onChange) {
			this.props.onChange(this.state.value);
		}
	},

	_cancel() {
		this.setState({edit: false, value: this.props.value});
	}

});

export default ClickToEdit;