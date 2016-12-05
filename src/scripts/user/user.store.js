// dependencies ----------------------------------------------------------------------

import React            from 'react';
import Reflux           from 'reflux';
import actions          from './user.actions.js';
import google           from '../utils/google';
import crn              from '../utils/crn';
import scitran          from '../utils/scitran';
import router           from '../utils/router-container';
import async            from 'async';
import notifications    from '../notification/notification.actions';
import dashboardActions from '../dashboard/datasets.actions';
import datasetActions   from '../dataset/dataset.actions';
import upload           from '../upload/upload.actions';

// store setup -----------------------------------------------------------------------

let UserStore = Reflux.createStore({

    listenables: actions,

    init() {
        this.setInitialState();

        // initialize google APIs
        google.init((err, user) => {
            this.update({
                token: user.token,
                google: user.profile
            }, {persist: true});
            if (user.token) {
                crn.verifyUser((err, res) => {
                    if (res.body.code === 403) {
                        this.signOut();
                    } else {
                        this.update({scitran: res.body}, {persist: true});
                    }
                });
            }
        });
    },

    getInitialState() {
        return this.data;
    },

    /**
     * Instance of Google Auth object
     * stored for further interaction.
     */
    authInstance: {},

// data ------------------------------------------------------------------------------

    data: {},

    update(data, options) {
        for (let prop in data) {
            this.data[prop] = data[prop];
            if (options && options.persist) {
                window.localStorage[prop] = JSON.stringify(data[prop]);
            }
        }
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
            token:   window.localStorage.token && window.localStorage.token !== 'undefined' ? JSON.parse(window.localStorage.token)   : null,
            google:  window.localStorage.google ? JSON.parse(window.localStorage.google) : null,
            scitran: window.localStorage.scitran ? JSON.parse(window.localStorage.scitran) : null,
            loading: false,
            signinError: '',
            showUploadModal: false
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data);
    },

// Auth Actions ----------------------------------------------------------------------

    /**
     * Signin
     *
     * Initiates the google OAuth2 sign in flow. Creates a new
     * user if the user doesn't already exist.
     */
    signIn(options) {
        if (!google.initialized) {return;}
        let transition = options.hasOwnProperty('transition') ? options.transition : true;
        google.signIn((err, user) => {
            if (err) {
                return;
            }

            this.update({
                loading: true,
                token:   user.token,
                google:  user.profile
            }, {persist: true});

            crn.verifyUser((err, res) => {
                if (res.body.code === 403) {
                    crn.createUser(user.profile, (err, res) => {
                        if (res.body.status === 403) {
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
                        crn.verifyUser((err, res) => {
                            this.handleSignIn(transition, res.body, user.profile);
                        });
                    });
                } else if (!res.body._id) {
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
                    this.handleSignIn(transition, res.body, user.profile);
                }
            });
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
            signout = confirm('You are currently uploading files. Signing out of this site will cancel the upload process. Are you sure you want to sign out?');
        }
        if (signout) {
            google.signOut(() => {
                upload.setInitialState();
                this.clearAuth();
                router.transitionTo('front-page');
            });
        }
    },

    /**
     * Clear Authentication
     *
     * Clears all user related data from memory and
     * browser storage.
     */
    clearAuth() {
        delete window.localStorage.token;
        delete window.localStorage.google;
        delete window.localStorage.scitran;
        this.setInitialState({
            token: null,
            google: null,
            scitran: null
        });
    },

    /**
     * Handle Sign In
     *
     * Handles necessary action after a signin has been completed.
     */
    handleSignIn(transition, scitran, google) {
        this.update({loading: false});
        this.update({scitran, google}, {persist: true});
        if (transition) {
            router.transitionTo('dashboard');
        } else {
            datasetActions.reloadDataset();
            dashboardActions.getDatasets(true);
        }
    },

    /**
     * Refresh Token
     *
     * The google client library will automatically refresh
     * the token behind the scenes when it is within 5 minutes
     * of expiring. Refresh should be called during that time
     * or after expiration to reset the local data to match
     * the updated token.
     */
    refreshToken(callback) {
        google.refresh((err, user) => {
            this.update({
                token: user.token,
                google: user.profile
            }, {persist: true});
            callback(user.token ? user.token.access_token : null);
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
        if (!window.localStorage.token || window.localStorage.token === 'undefined') {return false;}
        let token = JSON.parse(window.localStorage.token);
        return token && token.hasOwnProperty('access_token') && token.access_token;
    },

    // request queue -----------------------------------------------------------------

    /**
     * Authentication Request Queuing
     *
     * Before any request we verify the status of the OAuth token.
     * To avoid multiple signin dialogues in the event the token
     * is expired all auth checking is queued to be performed
     * synchronously. The 'checkAuth' method is the primary method
     * to start the token check process.
     */
    queue: async.queue((authReq, callback) => {
        let token = UserStore.data.token;
        let refreshWindow = 4 * 60 * 1000;
        if (!token || Date.now() + refreshWindow >= token.expires_at) {
            // refresh the token
            UserStore.refreshToken((access_token) => {
                authReq.successCallback(access_token, UserStore.isRoot());
                callback();
            });
        } else {
            authReq.successCallback(token.access_token, UserStore.isRoot());
            callback();
        }

    }, 1),

    checkAuth(successCallback, errorCallback) {
        let authReq = {successCallback, errorCallback};
        this.queue.push(authReq);
    },

    /**
     * Is Root
     *
     * Returns a boolean representing if the current user has
     * root permissions. Attempts to read in memory data and falls back
     * to checking local storage when necessary.
     */
    isRoot() {
        if (this.data.scitran && this.data.scitran.root) {return true;}
        if (window.localStorage.scitran && JSON.parse(window.localStorage.scitran).root) {return true;}
        else {return false;}
    },

// Actions ---------------------------------------------------------------------------

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
    }

});

export default UserStore;
