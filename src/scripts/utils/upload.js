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
        if (req.func) {
        // container creation requests
            let name = req.args[req.args.length - 1];
            req.progressStart(name);
            req.args.push((err, res) => {
                upload.handleResponse(err, req, res);
                callback();
            });
            req.func.apply(null, req.args);
        } else {
        // file upload requests
            req.progressStart(req.file.name);
            request.upload(req.url, {
                fields: {
                    name: req.file.relativePath,
                    tags: '[]',
                    file: req.file.data ? req.file.data : req.file
                }
            }, (err) => {
                upload.handleResponse(err, req);
                callback();
            });
        }
    }, maxRequests),

    /**
     * Add
     *
     * Takes a file request object & sends it into the
     * upload queue.
     */
    add (req) {
        this.queue.push(req);
    },

    /**
     * Handle Response
     */
    handleResponse(err, req, res) {
        let label = req.file ? req.file.name : req.args[req.args.length - 2];
        if (err) {
            upload.queue.kill();
            req.error();
        } else {
            if (res && req.callback) {
                req.callback(err, res);
            }
            req.progressEnd(label);
        }
    }

};

export default upload;