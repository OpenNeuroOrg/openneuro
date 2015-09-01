import request       from './request';
import superagent    from 'superagent';
import MD5           from './md5';
import config        from '../config';
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
		let self = this;
	    MD5(req.file, function (data) {
	    	req.hash   = data.hash;
			if (self.maxRequests >= self.activeRequests) {
				self.start(req)
			} else {
				self.queue.push(req);
			}
	    });
	},

	/**
	 * Start
	 *
	 * Takes a request object and starts an
	 * upload request. 
	 */
	start (req) {
		let self = this;
		self.activeRequests++;
		req.progressStart(req.file.name);
		request.post(req.url, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-MD5': req.hash
            },
            query: {
            	tags: JSON.stringify([req.tag])
            },
            body: req.file
        }, function (err, res) {
        	if (err) {
        		uploadActions.uploadError();
        	} else {
        		req.progressEnd(res.req._data.name);
	        	self.activeRequests--;
	        	if (self.queue.length > 0 && self.maxRequests >= self.activeRequests) {
	        		self.start(self.queue[0]);
	        		self.queue.shift();
	        	}
        	}
        });
	}

};

export default upload;