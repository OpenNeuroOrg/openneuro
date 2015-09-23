import request   from 'superagent';
import config    from '../config';

hello.init({google: config.auth.google.clientID});

/**
 * Request
 *
 * A wrapper for the superagent request library.
 * Provides a place for global request settings
 * and response handling.
 */
var Request = {

	get (url, options, callback) {
		handleRequest(url, options, function (url, options) {
			request.get(url)
				.set(options.headers)
				.query(options.query)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	},

	post (url, options, callback) {
		handleRequest(url, options, function (url, options) {
			request.post(url)
				.set(options.headers)
				.query(options.query)
				.send(options.body)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	},

	put (url, options, callback) {
		handleRequest(url, options, function (url, options) {
			request.put(url)
				.set(options.headers)
				.query(options.query)
				.send(options.body)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	},

	del (url, callback) {
		handleRequest(url, {}, function (url, options) {
			request.del(url)
				.set(options.headers)
				.end(function (err, res) {
					handleResponse(err, res, callback);
				});
		});
	}

};

/**
 * Handle Request
 *
 * A generic request handler used to intercept
 * requests before they request out. Ensures
 * access_token isn't expired sets it as the
 * Authorization header.
 *
 * Available options
 *   - headers: An object with keys set to the header name
 *   and values set to the corresponding header value.
 *   - query: An object with keys set to url query parameters
 *   and values set to the corresponding query values.
 *   - body: A http request body.
 *   - auth: A boolean determining whether the access token
 *   should be supplied with the request.
 */
function handleRequest (url, options, callback) {
	options = normalizeOptions(options);
	var google = hello('google');
	if (options.auth && hasToken() && url.indexOf('scitran') > -1) {
		hello('google').login({scope: 'email,openid', force: false}).then(function(res) {
			options.headers.Authorization = res.authResponse.access_token;
			callback(url, options);
		});
	} else {
		callback(url, options);
	}
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
	if (!options.hasOwnProperty('auth')) {options.auth = true;}
	return options;
}

function hasToken () {
	if (!window.localStorage.hello) {return false;}
	let credentials = JSON.parse(window.localStorage.hello); 
	return credentials.hasOwnProperty('google') && credentials.google.hasOwnProperty('access_token') && credentials.google.access_token;
}

export default Request;