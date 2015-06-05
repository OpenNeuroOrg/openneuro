// dependencies -------------------------------------------------------

import React from 'react';
import Actions from '../../actions/Actions';
import UserStore from '../../stores/userStore';
import {Navigation} from 'react-router';

var Signin = React.createClass({

	mixins: [Navigation],

// life cycle events --------------------------------------------------

	render: function () {
		return (
			<div className="view container">
				<div className="signInBlock col-sm-12 col-md-6 col-md-offset-3">
					<h2>Login</h2>
		    		<button className="btn-basic" onClick={this._signIn} >
						<i className="fa fa-google" />
						<span> Google</span>
					</button>
					<div className="footer">
						<button className="btn-admin" onClick={this._logToken} >Log Token</button>
						<button className="btn-admin" onClick={this._testScitran}>Test Scitran</button>
					</div>
				</div>
			</div>
    	);
		
	},

// custom methods -----------------------------------------------------

	_signIn: function () {
		Actions.signIn(this.transitionTo);
	},

	_logToken: function () {
		Actions.logToken();
	},

	_testScitran: function () {
		Actions.testScitran();
	}

});

export default Signin;