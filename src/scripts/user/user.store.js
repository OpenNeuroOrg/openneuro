// dependencies ----------------------------------------------------------------------

import React   from 'react';
import Reflux  from 'reflux';
import actions from './user.actions.js';
import config  from '../../../config';
import google  from '../utils/google';
import crn     from '../utils/crn';
import async   from 'async';

// store setup -----------------------------------------------------------------------

let UserStore = Reflux.createStore({

    listenables: actions,

    init() {
        this.setInitialState();

        // initialize google APIs
        google.init((token, profile, isSignedIn) => {
            this.update({
                token,
                google: profile
            }, {persist: true});
            crn.verifyUser((err, res) => {
                if (res.body.code === 403) {
                    this.signOut();
                } else {
                    this.update({scitran: res.body}, {persist: true});
                }
            });
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
        // console.log(window.localStorage.token == 'undefined' ? true : false);
        let data = {
            token:   window.localStorage.token !== 'undefined' ? JSON.parse(window.localStorage.token)   : null,
            google:  window.localStorage.google ? JSON.parse(window.localStorage.google) : null,
            scitran: window.localStorage.scitran ? JSON.parse(window.localStorage.scitran) : null,
            loading: false,
            signinError: '',
            showUploadModal: false
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data);
    },

// Actions ---------------------------------------------------------------------------

    signIn() {
        google.signIn((token, profile, isSignedIn) => {
            this.update({
                token,
                profile
            }, {persist: true});
        });
    },

    signOut() {
        google.signOut(() => {
            this.update({
                token: null,
                google: null,
            }, {persist: true});
        });
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
        console.log('refreshToken');
        google.refresh((token, profile, isSignedIn) => {
            this.update({
                token,
                profile
            }, {persist: true});
            callback(token.access_token);
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
        return token.hasOwnProperty('access_token') && token.access_token;
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
    queue: async.queue((authReq, callback) => {
        let token = UserStore.data.token;
        let refreshWindow = 4 * 60 * 1000
        // console.log(token.access_token, ' ', ((token.expires_at - Date.now())/1000).toFixed(0));
        if (!token || Date.now() + refreshWindow >= token.expires_at) {
            // refresh the token
            UserStore.refreshToken((access_token) => {
                authReq.successCallback(access_token);
                callback();
            });
        } else {
            authReq.successCallback(token.access_token);
            callback();
        }

    }, 1),

    checkAuth(successCallback, errorCallback) {
        let authReq = {successCallback, errorCallback};
        this.queue.push(authReq);
    }

});

export default UserStore;
