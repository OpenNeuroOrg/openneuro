// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from '../actions/Actions';
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
		let self = this;
		hello.init({google: config.auth.google.clientID});
		var googleAuth = hello('google').getAuthResponse();

		// this._user = {};
		this._token = googleAuth && googleAuth.access_token ? googleAuth.access_token : null;

		if (this._token) {
			hello('google').api('/me').then(function (profile) {
				self._user = profile;
			});
		} else {
			this._user = {};
		}
	},

	getInitialState: function () {
		return {token: this._token, data: this._user};
	},

// Actions ---------------------------------------------------------------------------

	/**
	 * Log In
	 *
	 * Initiates the google OAuth2 sign in flow.
	 */
	signIn: function () {
		let self = this;
		hello('google').login({scope: 'email,openid'}, function (res) {
			self._token = res.authResponse.access_token;
			hello(res.network).api('/me').then(function (profile) {
				self._user = profile;
				self.trigger({token: self._token, data: self._user});
			});
			// console.log('signin success');
		}, function () {
			console.log('signin failure');
		});
	},

	/**
	 * Sign Out
	 *
	 * Signs the user out by destroying the current
	 * OAuth2 session.
	 */
	signOut: function () {
		let self = this;
		hello('google').logout().then(function () {
			self._token = null;
			self.trigger({token: self._token});
		}, function (e) {
			console.log('signout failure');
			console.log(e);
		});
	},

	/**
	 * Is Logged In
	 *
	 * Return a boolean representing if the user is logged in.
	 */
	isLoggedIn: function () {
		return !!this._token;
	},

	/**
	 * Log Token
	 *
	 * Logs the current google access token stored in local storage.
	 */
	logToken: function () {
		console.log(this._token);
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
			.set('Authorization', this._token)
			.end(function (err, res) {
				console.log(res.body);
			});
	}
});

export default UserStore;