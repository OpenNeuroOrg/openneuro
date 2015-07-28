import request   from 'superagent';
import config    from '../config';
import userStore from '../user/user.store.js';

/**
 * Request
 *
 * A wrapper for the superagent request library.
 * Provides a place for global request settings
 * and response handling.
 */
var Request = {

	get (path, callback) {
		handleRequest(path, {}, function (path, options) {
			request.get(config.scitranUrl + path)
				.set('Authorization', userStore._token)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	},

	post (path, options, callback) {
		handleRequest(path, options, function (path, options) {
			request.post(config.scitranUrl + path)
				.set('Authorization', userStore._token)
				.set(options.headers)
				.send(options.body)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	},

	put (path, options, callback) {
		handleRequest(path, options, function (path, options) {
			request.put(config.scitranUrl + path)
				.set('Authorization', userStore._token)
				.set(options.headers)
				.query(options.query)
				.send(options.body)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	},

	del (path, callback) {
		handleRequest(path, {}, function (path, options) {
			request.del(config.scitranUrl + path)
				.set('Authorization', userStore._token)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	}

};

function handleRequest (path, options, callback) {
	options = normalizeOptions(options);
	var google = hello('google');
	hello('google').login({scope: 'email,openid', force: false}).then(function() {
		callback(path, options);
	});
}

/**
 * Handle Response
 *
 * A generic response handler used to intercept
 * responses before returning them to the main
 * callback.
 */
function handleResponse (err, res, callback) {
	callback(err, res);
}

/**
 * Normalize Options
 *
 * Takes a request options object and
 * normalizes it so requests won't fail.
 */
function normalizeOptions (options) {
	if (!options.headers) {options.headers = {};}
	if (!options.query)   {options.query   = {};}
	return options;
}

export default Request;