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
                clientName: 'crn_client_app2',
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
                Authorization: 'Basic ' + new Buffer(consumerKey + ':' + consumerSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
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
                'Content-Type': 'application/json',
            },
            body: {
                body: job
            }
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