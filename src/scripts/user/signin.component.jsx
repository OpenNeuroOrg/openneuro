// dependencies -------------------------------------------------------

import React        from 'react';
import Actions      from './user.actions.js';
import UserStore    from './user.store.js';
import scitran      from '../utils/scitran';

class Signin extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		return (
			<div className="signInBlock col-sm-12">
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
    	);
	}

// custom methods -----------------------------------------------------

	_signIn () {
		Actions.signIn();
	}

	_logToken () {
		Actions.logToken();
	}

	_testScitran () {
		scitran.verifyUser(function (err, res) {
			console.log(res);
		});
	}

}

export default Signin;