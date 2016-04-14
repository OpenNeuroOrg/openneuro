// dependencies ----------------------------------------------------------------------

import React            from 'react';
import Reflux  		    from 'reflux';
import Actions 		    from './user.actions.js';
import config  		    from '../../../config';
import router  		    from '../utils/router-container';
import scitran 		    from '../utils/scitran';
import crn     		    from '../utils/crn';
import upload  		    from '../upload/upload.actions';
import dashboardActions from '../dashboard/datasets.actions';
import datasetActions   from '../dataset/dataset.actions';
import notifications    from '../notification/notification.actions';

hello.init({google: config.auth.google.clientID});

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
			loading: false,
			signinError: '',
			showUploadModal: false
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

	/**
	 * Toggle Modal
	 */
	toggleModal(name) {
		let updates = {};
		updates['show' + name + 'Modal'] = !this.data['show' + name + 'Modal'];
		this.update(updates);
	},

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
			this.checkAuth((token) => {
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
	signIn(options) {
		let transition = options.hasOwnProperty('transition') ? options.transition : true;
		this.update({loading: true});
		hello('google').login({scope: 'email,openid'}, (res) => {
			if (res.error) {
				this.update({loading: false});
				return;
			}
			this.update({token: res.authResponse.access_token});
			hello(res.network).api('/me').then((profile) => {
				scitran.verifyUser((err, res) => {
					if (res.status === 403) {
						let user = {
							_id: profile.email,
							firstname: profile.first_name,
							lastname: profile.last_name
						};
						crn.createUser(user, (err, res) => {
							if (err) {
								this.clearAuth();
								let message = <span>This user account has been blocked. If you believe this is by mistake please contact the <a href="mailto:openfmri@gmail.com?subject=Center%20for%20Reproducible%20Neuroscience%20Blocked%20User" target="_blank">site adminstrator</a>.</span>;
								if (!transition) {
									notifications.createAlert({type: 'Error', message: message});
								} else {
									this.update({
										loading: false,
										signinError: message
									});
								}
								return;
							}
							scitran.verifyUser((err, res) => {
								this.handleSignIn(transition, res.body, profile);
							});
						});
					} else if (res.status !== 200) {
						this.clearAuth();
						let message = 'We are currently experiencing issues. Please try again later.';
						if (!transition) {
							notifications.createAlert({type: 'Error', message: message});
						} else {
							this.update({
								loading: false,
								signinError: message
							});
						}
					} else {
						this.handleSignIn(transition, res.body, profile);
					}
				});
			});
		}, () => {
			// signin failure
		});
	},

	/**
	 * Handle Sign In
	 *
	 * Handles necessary action after a signin has been completed.
	 */
	handleSignIn(transition, scitranUser, googleProfile) {
		window.localStorage.scitranUser = JSON.stringify(scitranUser);
		this.update({scitran: scitranUser, google: googleProfile, loading: false});
		if (transition) {
			router.transitionTo('dashboard');
		} else {
			datasetActions.reloadDataset();
			dashboardActions.getDatasets(true);
		}
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

	/**
	 * Get Preferences
	 *
	 * Calls back with the current user's preferences.
	 */
	getPreferences(callback) {
		callback(this.data.scitran.preferences);
	},

	/**
	 * Update Preferences
	 */
	updatePreferences(preferences, callback) {
		let scitranUser = this.data.scitran;
		scitranUser.preferences = scitranUser.preferences ? scitranUser.preferences : {};
		for (let key in preferences) {
			scitranUser.preferences[key] = preferences[key];
		}
		scitran.updateUser(this.data.scitran._id, {preferences: preferences}, (err, res) => {
			this.update({scitran: scitranUser});
			if (callback) {callback(err, res);}
		});
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
	},

// request queue ---------------------------------------------------------------------

	/**
	 * Authentication Request Queuing
	 *
	 * Before any request we verify the status of the OAuth token.
	 * To avoid multiple signin dialogues in the event the token
	 * is expired all auth checking is queued to be performed
	 * synchronously. The 'checkAuth' method is the primary method
	 * to start the token check process.
	 */

	queue: [],

	activeCheck: false,

	checkAuth(successCallback, errorCallback) {
		if (!this.activeCheck) {
			this.startAuthCheck(successCallback, errorCallback);
		} else {
			let authReq = {successCallback, errorCallback};
			this.queue.push(authReq);
		}
	},

	startAuthCheck(successCallback, errorCallback) {
		this.activeCheck = true;
		let currentAccount = window.localStorage.hasOwnProperty('scitranUser') ? JSON.parse(window.localStorage.scitranUser).email : '';
		hello('google').login({scope: 'email,openid', force: false, login_hint: currentAccount, display: 'none'}).then((res) => {
			successCallback(res.authResponse.access_token);
			this.activeCheck = false;
			if (this.queue.length > 0) {
				this.startAuthCheck(this.queue[0].successCallback, this.queue[0].errorCallback);
				this.queue.shift();
			}
		}, errorCallback);
	}

});

export default UserStore;