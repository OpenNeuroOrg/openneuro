// dependencies -------------------------------------------------------

import React from 'react';
import hello from '../../libs/hello';
import Actions from '../../actions/Actions';
import UserStore from '../../stores/userStore';

var Signin = React.createClass({

// life cycle events --------------------------------------------------

	componentDidMount: function () {
		
	},

	render: function () {
		return (
			<div>
				<h2>Sign in with Google</h2>
	    		<button className="btn btn-primary" onClick={this._signIn} >
					<i className="fa fa-google" />
					<span> Google</span>
				</button>
				<button className="btn btn-info" onClick={this._logToken} >Log Token</button>
				<button className="btn btn-warning" onClick={this._signOut}>Sign Out</button>
				<button className="btn btn-danger" onClick={this._testScitran}>Test Scitran</button>
			</div>
    	);
		
	},

// custom methods -----------------------------------------------------

	_signIn: function (e) {
		Actions.signIn();
	},

	_signOut: function (e) {
		Actions.signOut();
	},

	_logToken: function (e) {
		Actions.logToken();
	},

	_testScitran: function (e) {
		Actions.testScitran();
	}

});

export default Signin;