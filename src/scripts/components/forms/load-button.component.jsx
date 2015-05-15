import React from 'react'

var loadButton = React.createClass({
	getInitialState: function () {
		return {
			loading: false
		}
	},
	render: function () {
		var loading = this.state.loading;
		var text = this.props.text;
		return (
			<div className="form-group">
				<button onClick={this.signIn}>{text}</button> 
			</div>
		);
	},
	signIn: function () {
		alert('yo!');
	}
});

module.exports = loadButton;