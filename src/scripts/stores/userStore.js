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
		hello.init({google: config.auth.google.clientID});
		this.checkUser();
	},

	getInitialState: function () {
		return {token: this._token, user: this._user};
	},

// data ------------------------------------------------------------------------------

	_token: null,
	_user: null,

// Actions ---------------------------------------------------------------------------

	/**
	 * Check User
	 *
	 * Checks if the user has an active sessions and
	 * if they do instatiates their session data.
	 */
	checkUser: function () {
		let self = this;
		var googleAuth = hello('google').getAuthResponse();

		var token = googleAuth && googleAuth.access_token ? googleAuth.access_token : null;

		if (token) {
			hello('google').api('/me').then(function (profile) {
				self._user = profile;
				self._token = token;
				self.trigger({token: self._token, user: self._user});
			});
		} else {
			this._user = {};
		}
	},

	/**
	 * Log In
	 *
	 * Initiates the google OAuth2 sign in flow.
	 */
	signIn: function (transitionTo) {
		let self = this;
		hello('google').login({scope: 'email,openid'}, function (res) {
			self._token = res.authResponse.access_token;
			hello(res.network).api('/me').then(function (profile) {
				self._user = profile;
				self.trigger({token: self._token, user: self._user});
				transitionTo('upload');
			});
			// console.log('signin success');
		}, function () {
			// signin failure
		});
	},

	/**
	 * Sign Out
	 *
	 * Signs the user out by destroying the current
	 * OAuth2 session.
	 */
	signOut: function (transitionTo) {
		let self = this;
		hello('google').logout().then(function () {
			self._token = null;
			self._user = {null};
			self.trigger({token: self._token, user: self._user});
			transitionTo('home');
		}, function (e) {
			// signout failure
		});
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