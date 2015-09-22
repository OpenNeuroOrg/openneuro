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

	init() {
		this.setInitialState();
	},

	getInitialState() {
		return this.data;
	},

// data ------------------------------------------------------------------------------

	data: {},

	update(data) {
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
	setInitialState(diffs) {
		let data = {
			token: window.localStorage.hello ? JSON.parse(window.localStorage.hello).google.access_token : null,
			google: null,
			scitran: window.localStorage.scitranUser ? JSON.parse(window.localStorage.scitranUser) : null,
			loading: false
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
	initOAuth() {
		hello.init({google: config.auth.google.clientID});
		this.checkUser();
	},
	
	/**
	 * Check User
	 *
	 * Checks if the user has an active sessions and
	 * if they do instatiates their session data.
	 */
	checkUser() {
		var googleAuth = hello('google').getAuthResponse();
		var token = googleAuth && googleAuth.access_token ? googleAuth.access_token : null;

		if (token) {
			hello('google').login({force: false}).then((authRes) => {
				this.update({token: token});
				hello('google').api('/me').then((profile) => {
					this.update({google: profile});
					scitran.verifyUser((err, res) => {
						window.localStorage.scitranUser = JSON.stringify(res.body);
						this.update({scitran: res.body});
					});
				}, (res) => {
					this.setInitialState();
				});
			}, this.clearAuth);
		} else {
			this.setInitialState();
		}
	},

	/**
	 * Signin
	 *
	 * Initiates the google OAuth2 sign in flow. Creates a new
	 * user if the user doesn't already exist.
	 */
	signIn() {
		this.update({loading: true});
		hello('google').login({scope: 'email,openid'}, (res) => {
			this.update({token: res.authResponse.access_token});
			hello(res.network).api('/me').then((profile) => {
				scitran.verifyUser((err, res) => {
					if (res.status === 403) {
						let user = {
							email: profile.email,
							firstName: profile.first_name,
							lastName: profile.last_name
						};
						crn.createUser(user, (err, res) => {
							scitran.verifyUser((err, res) => {
								window.localStorage.scitranUser = JSON.stringify(res.body);
								router.transitionTo('dashboard');
								this.update({scitran: res.body, google: profile, loading: false});
							});
						});
					} else {
						window.localStorage.scitranUser = JSON.stringify(res.body);
						router.transitionTo('dashboard');
						this.update({scitran: res.body, google: profile, loading: false});
					}
				});
			});
		}, () => {
			// signin failure
		});
	},

	/**
	 * Sign Out
	 *
	 * Signs the user out by destroying the current
	 * OAuth2 session.
	 */
	signOut(uploadStatus) {
		let signout = true;
		if (uploadStatus === 'uploading') {
			signout = confirm("You are currently uploading files. Signing out of this site will cancel the upload process. Are you sure you want to sign out?");
		}
		if (signout) {
			hello('google').logout().then(() => {
				upload.setInitialState();
				this.clearAuth();
				router.transitionTo('signIn');
			}, (e) => {
				// signout failure
			});
		}
	},

// helper methods --------------------------------------------------------------------

	/**
	 * Clear Authentication
	 *
	 * Clears all user related data from memory and
	 * browser storage.
	 */
	clearAuth() {
		delete window.localStorage.hello;
		delete window.localStorage.scitranUser;
		this.setInitialState({
			token: null,
			google: null,
			scitran: null
		});
	},

	/**
	 * Has Token
	 *
	 * Returns a boolean representing whether or not
	 * the current session has an access token present
	 * regardless of whether or not is is expired/valid.
	 */
	hasToken() {
		if (!window.localStorage.hello) {return false;}
		let credentials = JSON.parse(window.localStorage.hello); 
		return credentials.hasOwnProperty('google') && credentials.google.hasOwnProperty('access_token') && credentials.google.access_token;
	},

	/**
	 * Is Token Valid
	 *
	 * Returns a boolean representing whether or not the
	 * current access token in valid.
	 */
	isTokenValid() {
		var session = hello('google').getAuthResponse();
		var currentTime = (new Date()).getTime() / 1000;
		return session && session.access_token && session.expires > currentTime;
	}

});

export default UserStore;