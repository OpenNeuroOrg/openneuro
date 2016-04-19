import request from './request';
import async   from 'async';

/**
 * Maximum Concurrent Requests
 */
let maxRequests = 3;

let upload = {

    /**
     * Queue
     *
     * A queueing strategy for upload requests.
     * Allows concurrency up to the value for
     * 'maxRequests'
     */
    queue: async.queue((req, callback) => {
        req.progressStart(req.file.name);
        request.upload(req.url, {
            fields: {
                name: req.file.name,
                tags: JSON.stringify(req.tags),
                file: req.file.data ? req.file.data : req.file
            }
        }, (err) => {
            if (err) {
                req.error(err, req);
            } else {
                req.progressEnd(req.file.name);
            }
            callback();
        });
    }, maxRequests),

    /**
     * Add
     *
     * Takes a file request object & sends it into the
     * upload queue.
     */
    add (req) {
        this.queue.push(req);
    }

};

export default upload;