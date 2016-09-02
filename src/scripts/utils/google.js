/* global gapi */

import config  from '../../../config';

let google = {

    authInstance: {},

    initialized: false,

    init(callback) {
        gapi.load('auth2', () => {
            gapi.client.load('plus', 'v1').then(() => {
                gapi.auth2.init({
                    client_id: config.auth.google.clientID,
                    scopes: 'email,openid'
                }).then((authInstance) => {
                    this.authInstance = authInstance;
                    this.initialized = true;
                    this.getCurrentUser(callback);
                });
            });
        });
    },

    refresh(callback) {
        if (this.initialized) {
            this.getCurrentUser(callback);
        } else {
            setTimeout(() => {
                this.refresh(callback);
            }, 500);
        }
    },

    signIn(callback) {

        let signinDeferred;
        (function(wrapped) {
            window.open = function() {
                // re-assign the original window.open after one usage
                window.open = wrapped;

                var win = wrapped.apply(this, arguments);
                var i = setInterval(function() {
                    if (win.closed) {
                        clearInterval(i);
                        // cancel has no effect when the promise is already resolved, e.g. by the success handler
                        // see http://docs.closure-library.googlecode.com/git/class_goog_Promise.html#goog.Promise.prototype.cancel
                        signinDeferred.cancel();
                    }
                }, 100);
                return win;
            };
        })(window.open);

        signinDeferred = this.authInstance.signIn({prompt: 'select_account'}).then(() => {
            this.getCurrentUser(callback);
        }, () => {
            callback('Sign in cancelled by user.', null);
        });
    },

    signOut(callback) {
        this.authInstance.signOut().then(() => {
            callback();
        });
    },

    getCurrentUser(callback) {
        // get user data
        let user = this.authInstance.currentUser.get();

        // token
        let token = null;
        for (let key in user) {
            if (user[key] && user[key].hasOwnProperty('access_token')) {
                token = user[key];
            }
        }

        // profile
        let basicProfile = user.getBasicProfile();
        let profile = null;
        if (basicProfile) {
            profile = {
                _id:       basicProfile.getEmail(),
                email:     basicProfile.getEmail(),
                firstname: basicProfile.getGivenName(),
                lastname:  basicProfile.getFamilyName(),
                imageUrl:  basicProfile.getImageUrl()
            };
        }

        // is signed in
        let isSignedIn = user.isSignedIn();
        callback(null, {token, profile, isSignedIn});
    }
};

export default google;