// dependencies -------------------------------------------------------

import React from 'react';
import hello from '../../libs/hello';

var Signin = React.createClass({

// life cycle events --------------------------------------------------

	componentDidMount: function () {
		hello.init({google: '197312322415-defuecdcn6gnbc8ieb75aph84o34ohrd.apps.googleusercontent.com'});
	},

	render: function () {
		return (
			<form>
				<h2>Sign in with Google</h2>
	    		<button className="btn btn-primary" onClick={this._signIn} >
					<i className="fa fa-google" />
					<span> Google</span>
				</button>
				<button className="btn btn-info" onClick={this._logToken} >Log Token</button>
				<button className="btn btn-warning" onClick={this._signOut}>Sign Out</button>
			</form>
    	);
		
	},

// custom methods -----------------------------------------------------

	_signIn: function () {
		hello('google').login();
	},

	_signOut: function () {
		hello('google').logout().then(function () {
			console.log('signout success');
		}, function (e) {
			console.log('signout failure');
			console.log(e);
		});
	},

	_logToken: function () {
		console.log(JSON.parse(window.localStorage.hello).google.access_token);
	}

});

export default Signin;