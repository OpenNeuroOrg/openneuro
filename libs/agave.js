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
            query: {
                clientName: 'crn_client',
                description: 'crn_client'
            }
        }, callback);
    },

    getAuthToken(consumerKey, consumerSecret, callback) {
        request.post(config.agave.url + 'token/v2', {
            headers: {
                Authorization: 'Basic ' + new Buffer(consumerKey + ':' + consumerSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            query: {
                username: config.agave.username,
                password: config.agave.password
            }
        }, callback);
    },

    createJob(job, accessToken, callback) {
        request.post(config.agave.url + 'jobs/v2', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            body: {
                'content-type': 'application/json',
                body: job
            }
        }, callback);
    }

}