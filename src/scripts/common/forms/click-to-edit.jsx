// dependencies -------------------------------------------------------

import React from 'react';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState() {
		return {
			value: this.props.value ? this.props.value : '',
			initialValue: this.props.value ? this.props.value : ''
		}
	},


	render() {
		let value = this.state.value;

		let display = <div><div>{value}</div><button onClick={this._edit}>click to edit</button></div>;
		let edit   = (
			<div>
				<textarea value={value} onChange={this._handleChange}></textarea>
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