import request       from './request';
import MD5           from './md5';
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
	    MD5(req.file, (data) => {
	    	req.hash   = data.hash;
			if (this.maxRequests >= this.activeRequests) {
				this.start(req)
			} else {
				this.queue.push(req);
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
            body: req.file.data ? req.file.data : req.file
        }, function (err, res) {
        	if (err) {
        		req.error(err, req);
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