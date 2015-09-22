import request from 'request';
import config  from '../config';

/**
 * Request
 *
 * A wrapper of npm 'request' to allow for
 * genericizing request and response manipulations.
 */
export default {

	post(url, options, callback) {
		handleRequest(url, options, (req) => {
			request.post(req, (err, res) => {
				handleResponse(err, res, callback);
			});
		});
	},


}

/**
 * Handle Request
 *
 * Processes all requests before they fire.
 */
function handleRequest(url, options, callback) {
	let req = {
		url: url,
		headers: {
			"X-SciTran-Auth": config.scitran.secret,
			'User-Agent': 'SciTran Drone CRN Server'
		},
		query: {},
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
 * Normalized request options.
 */
function parseOptions(req, options) {
	if (options.query)  {req.query = options.query;}
	if (options.body)   {req.json = options.body;}
	if (options.header) {
		for (let key in options.headers) {
			req.headers[key] = options.headers[key];
		}
	}

	return req;
}