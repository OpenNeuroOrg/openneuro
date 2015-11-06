import request from './request';
import config  from '../config';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran API.
 */
export default {

    /**
     * Create Client
     */
    createClient(callback) {
        request.post(config.agave.url + 'clients/v2', {
            headers: {
                Authorization: 'Basic ' + new Buffer(config.agave.username + ':' + config.agave.password).toString('base64')
            },
            body: {
                clientName: 'crn_client_app3',
                description: 'Agave client application for CRN interaction.'
            }
        }, callback);
    },

    listClients(callback) {
        request.get(config.agave.url + 'clients/v2', {
            headers: {
                Authorization: 'Basic ' + new Buffer(config.agave.username + ':' + config.agave.password).toString('base64')
            }
        }, callback);
    },

    getAuthToken(consumerKey, consumerSecret, callback) {
        request.post(config.agave.url + 'token', {
            headers: {
                authorization: 'Basic ' + new Buffer(consumerKey + ':' + consumerSecret).toString('base64'),
                'content-type': 'application/x-www-form-urlencoded'
            },
            query: {
                grant_type: 'client_credentials',
            },
            body: {
                scope: 'PRODUCTION',
            }
        }, callback);
    },

    createJob(job, accessToken, callback) {
        request.post(config.agave.url + 'jobs/v2', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            body: job
        }, callback);
    },

    listJobs(accessToken, callback) {
        request.get(config.agave.url + 'jobs/v2/', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            }
        }, callback);
    }

}