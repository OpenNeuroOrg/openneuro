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
				input = <textarea className="form-control" value={value} onChange={this._handleChange}></textarea>;
				break;
			case "object":
				input = (
					<div className="cte-edit-array">
						<ArrayInput value={value} onChange={this._handleChange} />
					</div>
				);
				break;
		}

		let editBtn;
		if (this.props.editable) {
			editBtn = <button onClick={this._edit} className="cte-edit-button btn btn-admin fadeIn"><span>edit </span><i className="fa fa-pencil"></i></button>;
		}

		let display = (
			<div className="cte-display">
				<div className="fadeIn">{value}</div>
			</div>
		);

		let edit = (
			<div className="cte-edit fadeIn">
				{input}
				<div className="btn-wrapper">
					<button className="cte-cancel-btn btn btn-admin cancel" onClick={this._cancel}>cancel</button>
					<button className="cte-save-btn btn btn-admin admin-blue " onClick={this._save}>save</button>
					</div>
				<Spinner active={this.state.loading} />
			</div>
		);

		return (
			<div className="form-group" >
				<label>{this.props.label} {!this.state.edit ? editBtn : null}</label>
				<div>
					{this.state.edit ? edit : display}
				</div>
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