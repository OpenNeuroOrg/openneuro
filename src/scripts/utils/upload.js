import request from './request';
import MD5     from './md5';

let upload = {

	queue: [],
	activeRequests: 0,
	maxRequests: 1,

	add (req) {
		let self = this;
	    MD5(req.file, function (data) {
	    	delete req.file;
	    	req.hash   = data.hash,
	    	req.buffer = data.buffer;
			if (self.maxRequests >= self.activeRequests) {
				self.start(req)
			} else {
				self.queue.push(req);
			}
	    });
	},

	start (req) {
		console.log('request start');

		let self = this;
		self.activeRequests++;

		request.put(req.url, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-MD5': req.hash
            },
            body: req.buffer
        }, function (err, res) {
        	console.log('request end');
        	self.activeRequests--;
        	if (self.queue.length > 0 && self.maxRequests >= self.activeRequests) {
        		self.start(self.queue[0]);
        		self.queue.shift();
        	}
        });
	}


};

export default upload;