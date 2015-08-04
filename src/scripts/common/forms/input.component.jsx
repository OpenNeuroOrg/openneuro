// dependencies -------------------------------------------------------

import React from 'react'

// component setup ----------------------------------------------------

export default class Input extends React.Component {

// life cycle events --------------------------------------------------
	
	render() {
		let placeholder = this.props.placeholder;
		let type = this.props.type;
		let name = this.props.name;
		let value = this.props.value;
		return (
			<div className="form-group">
				{ value.length > 0 ? <label>{placeholder}</label> : null }
				<input type={type} name={name} placeholder={placeholder} value={value} onChange={this.handleChange.bind(this)} />
			</div>
		);
	}

// custom methods -----------------------------------------------------

	handleChange(event) {
		this.props.onChange(event);
	}
}

// props --------------------------------------------------------------

Input.propTypes = {
	name: React.PropTypes.string
};


Input.props = {
	name: ''
};