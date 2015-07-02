/**
 * Request
 *
 * A wrapper for the superagent request library.
 * Provides a place for global request settings
 * and response handling.
 */

import request   from 'superagent';
import config    from '../config';
import userStore from '../user/user.store.js';

var Request = {

	get (path, callback) {
		let self = this;
		request.get(config.scitranUrl + path)
			.set('Authorization', userStore._token)
			.end(function (err, res) {
				self.handlResponse(err, res, callback);
			});
	},

	post (path, body, callback) {
		let self = this;
		request.post(config.scitranUrl + path)
			.set('Authorization', userStore._token)
			.send(body)
			.end(function (err, res) {
				self.handleResponse(err, res, callback);
			});
	},

	upload (path, MD5, dataURL, fileName) {
		request.put(config.scitranUrl + path)
			.set('Authorization', userStore._token)
			.set('Content-Type', 'application/octet-stream')
			.set('Content-MD5', MD5)
			.send(dataURL)
			//.attach('--data-binary', dataURL)
			.end(function (err, res) {
				console.log('//////////////////////////////////////////////////')
				console.log(err);
				console.log(res);
			});

	},

	handleResponse (err, res, callback) {
		callback(err, res);
	}

};

export default Request;