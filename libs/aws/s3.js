import aws    from 'aws-sdk';
import fs     from 'fs';
import files  from '../files';
import config from '../../config';
import async  from 'async';

aws.config.loadFromPath('./aws-config.json');

let s3 = new aws.S3({httpOptions: {timeout: 5 * 60 * 1000}});

let concurrency = 5;

let s3lib = {

    api: s3,

    queue: async.queue((req, cb) => {
        // assign last argument as callback for
        // queued function and queue callback
        req.arguments.push(function () {
            if (req.cb) {req.cb.apply(arguments);}
            cb.apply(arguments);
        });
        req.function.apply(this, req.arguments);
    }, concurrency),

    createBucket(bucketName, callback) {
        s3.createBucket({Bucket: bucketName}, function(err, res) {
            callback(err, res);
        });
    },


    uploadFile(filePath, remotePath, callback) {
        fs.readFile(filePath, (err, data) => {
            let contentType = files.getContentType(filePath);

            let upload = new aws.S3.ManagedUpload({
                params: {
                    ACL: 'private',
                    Bucket: 'openneuro.snapshots',
                    Key: remotePath,
                    Body: data,
                    ContentType: contentType
                }
            });

            upload.send((err) => {
                if (err) {
                    // console.log(err);
                } else {
                    callback();
                }
            });
        });
    },

    uploadSnapshot(snapshotHash, callback) {
        let dirPath = config.location + '/persistent/datasets/' + snapshotHash;
        files.getFiles(dirPath, (files) => {
            async.each(files, (filePath, cb) => {
                let remotePath = filePath.slice((config.location + '/persistent/datasets/').length);
                this.queue.push({
                    function: this.uploadFile,
                    arguments: [
                        filePath,
                        remotePath
                    ],
                    cb
                });
            }, ()  => {
                // tag upload as complete
                s3.putObjectTagging({
                    Bucket: 'openneuro.snapshots',
                    Key: snapshotHash + '/dataset_description.json',
                    Tagging: {
                        TagSet: [
                            {
                                Key: 'datasetComplete',
                                Value: 'true'
                            }
                        ]
                    }
                }, () => {
                    callback();
                });
            });
        });
    }

};

export default s3lib;