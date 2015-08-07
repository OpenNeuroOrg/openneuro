// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from './user.actions.js';
import config  from '../config';
import router  from '../utils/router-container';
import scitran from '../utils/scitran';

let UserStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	init: function () {
		this.setInitialState();
	},

	getInitialState: function () {
		return this.data;
		// return {token: this._token, user: this._user};
	},

// data ------------------------------------------------------------------------------

	data: {},

	update: function (data) {
		for (let prop in data) {this.data[prop] = data[prop];}
		this.trigger(this.data);
	},

	/**
	 * Set Initial State
	 *
	 * Sets the state to the data object defined
	 * inside the function. Also takes a diffs object
	 * which will set the state to the initial state
	 * with any differences passed.
	 */
	setInitialState: function (diffs) {
		let data = {
			token: null,
			user: null
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

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
					self.update({user: profile, token: token});
				}, function (res) {
					self.setInitialState();
				});
			});
		} else {
			this.setInitialState();
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
			self.update({token: res.authResponse.access_token});
			hello(res.network).api('/me').then(function (profile) {
				self.update({user: profile});
				router.transitionTo('dashboard');
			});
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
			self.setInitialState();
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