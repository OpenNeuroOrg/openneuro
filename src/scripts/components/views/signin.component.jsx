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
			<div className="signInBlock col-sm-12 col-md-6 col-md-offset-3">
			<h2>Login</h2>
	    		<button className="btn-basic" onClick={this._signIn} >
					<i className="fa fa-google" />
					<span> Google</span>
				</button>
				<button className="btn-basic" onClick={this._signOut}>Sign Out</button>
				<div className="footer">
					<button className="btn-admin" onClick={this._logToken} >Log Token</button>
					<button className="btn-admin" onClick={this._testScitran}>Test Scitran</button>
				</div>
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