// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from './user.actions.js';
import config  from '../config';
import router  from '../utils/router-container';
import scitran from '../utils/scitran';

let UserStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	getInitialState: function () {
		return {token: this._token, user: this._user};
	},

// data ------------------------------------------------------------------------------

	_token: window.localStorage.hello ? JSON.parse(window.localStorage.hello).google.access_token : null,
	_user: null,

// Actions ---------------------------------------------------------------------------

	updateState: function () {
		this.trigger({token: this._token, user: this._user});
	},

	/**
	 * Initialize OAuth
	 *
	 * Initializes the OAuth libarary (hello.js) and checks
	 * if a user is currently logged in.
	 */
	initOAuth: function () {
		hello.init({google: config.auth.google.clientID});
		this.checkUser();
	},

	/**
	 * Clear State
	 *
	 */
	clearState: function () {
		this._token = null;
		this._user = null;
		delete window.localStorage.hello;
		this.updateState();
	},
	
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
			hello('google').login({force: false}).then(function() {
				hello('google').api('/me').then(function (profile) {
					self._user = profile;
					self._token = token;
					self.updateState();
				}, function (res) {
					self.clearState();
				});
			});
		} else {
			this.clearState();
		}
	},

	/**
	 * Add User
	 *
	 * Takes a gmail address and a first and last
	 * name and adds the user as a user.
	 */
	addUser: function (userData) {
		scitran.addUser(userData, function (err, res) {

		});
	},

	/**
	 * Remove User
	 *
	 * Takes a userId and removes the user.
	 */
	removeUser: function (userId) {
		scitran.removeUser(userId, function (err, res) {
			
		});
	},

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
				self.updateState();
				router.transitionTo('dashboard');
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
	signOut: function () {
		let self = this;
		hello('google').logout().then(function () {
			self._token = null;
			self._user = {null};
			self.updateState();
			router.transitionTo('home');
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

});

export default UserStore;