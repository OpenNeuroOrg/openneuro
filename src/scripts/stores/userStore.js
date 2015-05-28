// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from '../actions/Actions';
import hello   from '../libs/hello';
import request from 'superagent';
import config  from '../config';

let UserStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	/**
	 * Init
	 *
	 * Initializes hello.js with the google client ID when
	 * the store initializes.
	 */
	init: function () {
		hello.init({google: config.auth.google.clientID}); //, {redirect_uri: 'https://scitran.sqm.io/components/authentication/oauth2callback.html'});
	},

// Actions ---------------------------------------------------------------------------

	/**
	 * Log In
	 *
	 * Initiates the google OAuth2 sign in flow.
	 */
	signIn: function () {
		hello('google').login();
	},

	/**
	 * Sign Out
	 *
	 * Signs the user out by destroying the current
	 * OAuth2 session.
	 */
	signOut: function () {
		hello('google').logout().then(function () {
			console.log('signout success');
		}, function (e) {
			console.log('signout failure');
			console.log(e);
		});
	},

	/**
	 * Log Token
	 *
	 * Logs the current google access token stored in local storage.
	 */
	logToken: function () {
		console.log(JSON.parse(window.localStorage.hello).google.access_token);
	},

	/**
	 * Test Scitran
	 *
	 * Generates a get request to the users/self endpoint of
	 * the scitran API in order to test if authenticated
	 * requests are working.
	 */
	testScitran: function () {
		console.log('test scitran');
		request.get('https://scitran.sqm.io/api/users/self')
			.set('Authorization', JSON.parse(window.localStorage.hello).google.access_token)
			.end(function (err, res) {
				console.log(res.body);
			});
	}
});

export default UserStore;