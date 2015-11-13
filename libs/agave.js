import request from './request';
import config  from '../config';

let userAuth   = 'Basic ' + new Buffer(config.agave.username + ':' + config.agave.password).toString('base64'),
    clientAuth = 'Basic ' + new Buffer(config.agave.consumerKey + ':' + config.agave.consumerSecret).toString('base64');

let token = {
    access: null,
    refresh: null,
    expiresIn: 0,
    created: 0
};

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran API.
 */
export default {

// Client Management --------------------------------------------------------------------------

    /**
     * Create Client
     */
    createClient(callback) {
        request.post(config.agave.url + 'clients/v2', {
            headers: {
                Authorization: userAuth
            },
            body: {
                clientName: 'crn_client_app',
                description: 'Agave client application for CRN interaction.'
            }
        }, callback);
    },

    /**
     * List Clients
     */
    listClients(callback) {
        request.get(config.agave.url + 'clients/v2', {
            headers: {
                Authorization: userAuth
            }
        }, callback);
    },

// Authentication -----------------------------------------------------------------------------

    /**
     * Get Access Token
     */
    getAccessToken(callback) {
        request.post(config.agave.url + 'token', {
            headers: {
                authorization: clientAuth,
                'content-type': 'application/x-www-form-urlencoded'
            },
            query: {
                grant_type: 'password',
                username: config.agave.username,
                password: config.agave.password
            },
            body: {
                scope: 'PRODUCTION',
            }
        }, (err, res) => {
            token.access = res.body.access_token;
            token.refresh = res.body.refresh_token;
            token.created = Math.round((new Date).getTime() / 1000);
            token.expiresIn = res.body.expires_in;
            callback();
        });
    },

    /**
     * Refresh Access Token
     */
    refreshAccessToken(callback) {
        request.post(config.agave.url + 'token', {
            headers: {
                authorization: clientAuth,
                'content-type': 'application/x-www-form-urlencoded'
            },
            query: {
                grant_type: 'refresh_token',
                refresh_token: tokens.refresh
            },
            body: {
                scope: 'PRODUCTION'
            }
        }, (err, res) => {
            token.access = res.body.access_token;
            token.refresh = res.body.refresh_token;
            token.created = Math.round((new Date).getTime() / 1000);
            token.expiresIn = res.body.expires_in;
            callback();
        });
    },

    /**
     * Auth
     *
     * Run before any token authenticated request.
     * Ensures current token is valid and refreshs
     * if it's expired before continuing original
     * request.
     */
    auth(callback) {
        let now = Math.round((new Date).getTime() / 1000);

        if (!token.access) {
            this.getAccessToken(callback);
        } else if (now - token.created > token.expiresIn - 5) {
            this.refreshAccessToken(callback);
        } else {
            callback();
        }
    },

// Apps ---------------------------------------------------------------------------------------

    listApps(callback) {
        this.auth(() => {
            request.get(config.agave.url + 'apps/v2', {
                headers: {
                    Authorization: 'Bearer ' + token.access,
                    'Content-Type': 'application/json',
                }
            }, callback);
        });
    },

// Job Management -----------------------------------------------------------------------------

    createJob(job, callback) {
        this.auth(() => {
            request.post(config.agave.url + 'jobs/v2', {
                headers: {
                    Authorization: 'Bearer ' + token.access,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache'
                },
                body: job
            }, callback);
        });
    },

    listJobs(callback) {
        this.auth(() => {
            request.get(config.agave.url + 'jobs/v2/', {
                headers: {
                    Authorization: 'Bearer ' + token.access,
                    'Content-Type': 'application/json',
                }
            }, callback);
        });
    }

}