// dependencies -------------------------------------------------------

import React      from 'react';
import ArrayInput from './array-input.jsx';
import Spinner    from '../partials/spinner.component.jsx';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			editable: true,
			value: ''
		};
	},

	getInitialState() {
		return {
			value: this.props.value,
			initialValue: JSON.stringify(this.props.value),
			loading: false
		};
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
						<ArrayInput value={value} onChange={this._handleChange} />
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
				<Spinner active={this.state.loading} />
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
		let self = this;
		this.setState({loading: true});
		if (this.props.onChange) {
			this.props.onChange(this.state.value, () => {
				let initialValue = JSON.stringify(this.state.value);
				self.setState({loading: false, edit: false, initialValue: initialValue});
			});
		}
	},

	_cancel() {
		let value = JSON.parse(this.state.initialValue);
		this.setState({edit: false, value: value});
	}

});

export default ClickToEdit;