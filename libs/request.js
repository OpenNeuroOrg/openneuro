import config  from '../config';
import request from 'request';

/**
 * Request
 *
 * A wrapper of npm 'request' to allow for
 * genericizing request and response manipulations.
 */
export default {

	get(url, options, callback) {
		handleRequest(url, options, (req) => {
			request.get(req, (err, res) => {
				handleResponse(err, res, callback);
			});
		});
	},

	post(url, options, callback) {
		handleRequest(url, options, (req) => {
			request.post(req, (err, res) => {
				handleResponse(err, res, callback);
			});
		});
	},

	put (url, options, callback) {
		handleRequest(url, options, (req) => {
			request.put(req, (err, res) => {
				handleResponse(err, res, callback);
			});
		});
	},

	del(url, options, callback) {
		handleRequest(url, options, (req) => {
			request.del(req, (err, res) => {
				handleResponse(err, res, callback);
			});
		});
	}


}

/**
 * Handle Request
 *
 * Processes all requests before they fire.
 */
function handleRequest(url, options, callback) {
	let req = {
		url: url,
		headers: {},
		qs: {},
		json: {}
	};

	req = parseOptions(req, options);
	callback(req);
}

/**
 * Handle Response
 *
 * Process all responses before they return
 * to the callback.
 */
function handleResponse(err, res, callback) {
	callback(err, res);
}

/**
 * Parse Options
 *
 * Normalizes request options.
 */
function parseOptions(req, options) {
	if (options.query)  {req.qs = options.query;}
	if (options.body)   {req.json = options.body;}
	if (req.url && req.url.indexOf(config.scitran.url) > -1) {
		req.headers = {
			"X-SciTran-Auth": config.scitran.secret,
			'User-Agent': 'SciTran Drone CRN Server'
		};
	}
	if (options.headers) {
		for (let key in options.headers) {
			req.headers[key] = options.headers[key];
		}
	}
	return req;
}