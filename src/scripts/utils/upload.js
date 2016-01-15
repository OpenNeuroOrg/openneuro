import request       from './request';
import userStore     from '../user/user.store.js';
import uploadActions from '../upload/upload.actions.js';

let upload = {

	queue: [],
	activeRequests: 0,
	maxRequests: 2,

	/**
	 * Add
	 *
	 * Takes a file request object, generates
	 * an MD5 hash and then sends it into the
	 * upload queue.
	 */
	add (req) {
		if (this.maxRequests >= this.activeRequests) {
			this.start(req)
		} else {
			this.queue.push(req);
		}
	},

	/**
	 * Start
	 *
	 * Takes a request object and starts an
	 * upload request.
	 */
	start (req) {
		this.activeRequests++;
		req.progressStart(req.file.name);
		request.upload(req.url, {
			fields: {
				name: req.file.name,
				tags: JSON.stringify(req.tags),
				file: req.file.data ? req.file.data : req.file,
			}
		}, (err, res) => {
        	if (err) {
        		req.error(err, req);
        	} else {
        		req.progressEnd(req.file.name);
	        	this.activeRequests--;
	        	if (this.queue.length > 0 && this.maxRequests >= this.activeRequests) {
	        		this.start(this.queue[0]);
	        		this.queue.shift();
	        	}
        	}
        });
	}

};

export default upload;