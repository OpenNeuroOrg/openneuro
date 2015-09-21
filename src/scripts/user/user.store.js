// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from './user.actions.js';
import config  from '../config';
import router  from '../utils/router-container';
import scitran from '../utils/scitran';
import crn     from '../utils/crn';
import upload  from '../upload/upload.actions';

let UserStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	init: function () {
		this.setInitialState();
	},

	getInitialState: function () {
		return this.data;
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
			token: window.localStorage.hello ? JSON.parse(window.localStorage.hello).google.access_token : null,
			google: null,
			scitran: window.localStorage.scitranUser ? JSON.parse(window.localStorage.scitranUser) : null
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
			hello('google').login({force: false}).then(function(authRes) {
				self.update({token: token});
				hello('google').api('/me').then(function (profile) {
					self.update({google: profile});
					scitran.verifyUser(function (err, res) {
						window.localStorage.scitranUser = JSON.stringify(res.body);
						self.update({scitran: res.body});
					});
				}, function (res) {
					self.setInitialState();
				});
			}, self.clearAuth);
		} else {
			this.setInitialState();
		}
	},

	signUp: function () {
		hello('google').login({scope: 'email,openid'}, (res) => {
			hello(res.network).api('/me').then((profile) => {
				let user = {
					email: profile.email,
					firstName: profile.first_name,
					lastName: profile.last_name
				};
				crn.createUser(user, (err, res) => {
					console.log(err);
					console.log(res);
				});
			});
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
				self.update({google: profile});
				scitran.verifyUser(function (err, res) {
					window.localStorage.scitranUser = JSON.stringify(res.body);
					self.update({scitran: res.body});
				});
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
	signOut: function (uploadStatus) {
		let self = this;
		let signout = true;
		if (uploadStatus === 'uploading') {
			signout = confirm("You are currently uploading files. Signing out of this site will cancel the upload process. Are you sure you want to sign out?");
		}
		if (signout) {
			hello('google').logout().then(function () {
				upload.setInitialState();
				self.clearAuth();
				router.transitionTo('signIn');
			}, function (e) {
				// signout failure
			});
		}
	},

	clearAuth: function () {
		delete window.localStorage.hello;
		delete window.localStorage.scitranUser;
		this.setInitialState({
			token: null,
			google: null,
			scitran: null
		});
	},


	hasToken: function () {
		if (!window.localStorage.hello) {return false;}
		let credentials = JSON.parse(window.localStorage.hello); 
		return credentials.hasOwnProperty('google') && credentials.google.hasOwnProperty('access_token') && credentials.google.access_token;
	},

	isTokenValid: function (session) {
		var session = hello('google').getAuthResponse();
		var currentTime = (new Date()).getTime() / 1000;
		return session && session.access_token && session.expires > currentTime;
	}

});

export default UserStore;