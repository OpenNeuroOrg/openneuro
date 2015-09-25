// dependencies -------------------------------------------------------

import React from 'react'

// component setup ----------------------------------------------------

let Input = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState() {
		return {value: this.props.initialValue ? this.props.initialValue : ''}
	},

	render() {
		let placeholder = this.props.placeholder;
		let type = this.props.type;
		let name = this.props.name;
		let value = this.props.hasOwnProperty('value') ? this.props.value : this.state.value;
		return (
			<div className="form-group float-label-input">
				{value.length > 0 ? <label>{placeholder}</label> : null}
				<input type={type} name={name} placeholder={placeholder} value={value} onChange={this.handleChange} />
			</div>
		);
	},

// custom methods -----------------------------------------------------

	handleChange(event) {
		this.setState({value: event.target.value});

		if (this.props.onChange) {
			this.props.onChange(event);
		}
	}

});

export default Input;