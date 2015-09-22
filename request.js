import request from 'request';
import config  from './config';

export default {

	post(url, options, callback) {
		handleRequest(url, options, (req) => {
			request.post(req, (err, res) => {
				handleResponse(err, res, callback);
			});
		});
	},


}

function handleRequest(relURL, options, callback) {
	let req = {
		url: config.scitran.baseURL + relURL,
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

function handleResponse(err, res, callback) {
	callback(err, res);
}

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