import React from 'react'

var Text = React.createClass({
	propTypes: {
		name: React.PropTypes.string
	},
	getInitialState: function() {
    	return {
    		value: '',
    		showLabel: false
    	};
    },
	render: function () {
		let props = this.props;
		let placeholder = this.props.placeholder;
		let type = this.props.type;
		let name = this.props.name;
		let value = this.props.value;
		return (
			<div className="form-group">
				{ this.state.showLabel ? <label>{placeholder}</label> : null }
				<input type={type} name={name} placeholder={placeholder} value={value} onChange={this.handleChange} />
			</div>
		);
	},
	handleChange: function (event) {
		this.setState({value: event.target.value});
		if (event.target.value.length > 0) {
			this.setState({showLabel: true});
		} else {
			this.setState({showLabel: false});
		}
		if (this.props.onChange) {
			this.props.onChange(event);
		}
	}
});

module.exports = Text;