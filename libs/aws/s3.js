import aws    from 'aws-sdk';
import fs     from 'fs';
import files  from '../files';
import config from '../../config';
import async  from 'async';

aws.config.loadFromPath('./aws-config.json');

let s3 = new aws.S3({httpOptions: {timeout: 5 * 60 * 1000}});

let concurrency = 3;

let s3lib = {

    api: s3,

    queue: async.queue((req, cb) => {
        s3lib.uploadFile(req.filePath, req.remotePath, () => {
            cb();
            req.cb();
        });
    }, concurrency),

    createBucket(bucketName, callback) {
        s3.createBucket({Bucket: bucketName}, function(err, res) {
            callback(err, res);
        });
    },


    uploadFile(filePath, remotePath, callback) {
        fs.readFile(filePath, (err, data) => {
            let contentType = files.getContentType(filePath);

            let params = {
                ACL: 'private',
                Bucket: 'openneuro.snapshots',
                Key: remotePath,
                Body: data,
                ContentType: contentType
            };

            let upload = new aws.S3.ManagedUpload({params});
            upload.send(function(err) {
                if (err) {
                    // console.log(err);
                }
                callback();
            });
        });
    },

    uploadDirectory(dirPath, callback) {
        files.getFiles(dirPath, (files) => {
            async.each(files, (filePath, cb) => {
                let remotePath = filePath.slice((config.location + '/persistent/datasets/').length);
                this.queue.push({
                    filePath,
                    remotePath,
                    cb
                });
            }, ()  => {
                s3.putObjectTagging({
                    Bucket: 'openneuro.snapshots',
                    Key: dirPath.slice((config.location + '/persistent/datasets/').length) + '/dataset_description.json',
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