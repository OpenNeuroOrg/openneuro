import React from 'react'

let LoadButton = React.createClass({
	getInitialState: function () {
		return {
			loading: false
		}
	},
	render: function () {
		let loading = this.state.loading;
		let text = this.props.text;
		let faIcon = this.props.faIcon
		return (
				<button className="btn btn-primary" onClick={this.signIn} >
					<i className={faIcon ? 'fa ' + faIcon : null} />
					{text ? text : null}
				</button> 
		);
	},
	signIn: function () {
		console.log('google yo!');
	}
});

module.exports = LoadButton;