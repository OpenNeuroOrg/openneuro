/*eslint no-console: ["error", { allow: ["log"] }] */
// dependencies ------------------------------------------------------------

import aws     from '../libs/aws';
import scitran from '../libs/scitran';
import crypto  from 'crypto';
import uuid    from 'uuid';
import mongo         from '../libs/mongo';
import {ObjectID}    from 'mongodb';
import archiver      from 'archiver';
import config from '../config';
import async from 'async';
import notifications from '../libs/notifications';
import emitter from '../libs/events';

let c = mongo.collections;
let events = config.events;

// handlers ----------------------------------------------------------------

/**
 * Jobs
 *
 * Handlers for job actions.
 */
let handlers = {

    /**
     * Create Job Definition
     */
    createJobDefinition(req, res, next) {
        let jobDef = Object.assign({},req.body);

        aws.batch.registerJobDefinition(jobDef, (err, data) => {
            if (err) {
                console.log(err);
                return next(err);
            } else {
                let extendeJobDef = data;
                extendeJobDef.parameters = req.body.parameters || {};
                extendeJobDef.descriptions = req.body.descriptions || {};
                extendeJobDef.parametersMetadata = req.body.parametersMetadata || {};
                extendeJobDef.analysisLevels = req.body.analysisLevels || [];
                c.crn.jobDefinitions.insertOne(extendeJobDef, (err) => {
                    if(err){
                        //TODO -- error handling? make response dependant on inserting document?
                    }
                });
                // can go ahead and respond to client without waiting on mongo insert
                res.send(data);
            }
        });
    },

    /**
    * Disable Job Definition
    */
    disableJobDefinition(req, res, next) {
        let jobArn = req.body.arn;
        aws.batch.sdk.deregisterJobDefinition({jobDefinition: jobArn}, (err, data) => {
            if (err) {
                return next(err);
            } else {
                res.send(data);
            }
        });
    },

    /**
     * Describe Job Definitions
     */
    describeJobDefinitions(req, res, next) {
        //recursive function to handle grabbing all job definitions if more than 100 exist on batch
        let getJobDefinitions = (params, jobDefs, callback) => {
            aws.batch.sdk.describeJobDefinitions(params, (err, data) => {
                if(err) {return callback(err);}
                jobDefs = jobDefs.concat(data.jobDefinitions);
                if(data.nextToken) {
                    params.nextToken = data.nextToken;
                    getJobDefinitions(params, jobDefs, callback);
                } else {
                    callback(null, jobDefs);
                }
            });
        };

        c.crn.jobDefinitions.find({}, {jobDefinitionArn: true}).toArray((err, appDefs) => {
            let arns = appDefs.map((app) => {
                return app.jobDefinitionArn;
            });
            getJobDefinitions({jobDefinitions: arns}, [], (err, jobDefs) => {
                if (err) {
                    console.log(err);
                    return next(err);
                } else {
                    let definitions = {};
                    //need to attach job definition descriptions from mongo to job defs returned from AWS batch
                    async.each(jobDefs, (definition, cb) => {
                        if (!definitions.hasOwnProperty(definition.jobDefinitionName)) {
                            definitions[definition.jobDefinitionName] = {};
                        }
                        c.crn.jobDefinitions.find({
                            jobDefinitionName: definition.jobDefinitionName,
                            jobDefinitionArn: definition.jobDefinitionArn,
                            revision: definition.revision
                        }, {descriptions: true, parameters: true, parametersMetadata: true, analysisLevels: true}).toArray((err, def) => {
                            // there will either be a one element array or an empty array returned
                            let parameters = def.length === 0 || !def[0].parameters ? {} : def[0].parameters;
                            let descriptions = def.length === 0 || !def[0].descriptions ? {} : def[0].descriptions;
                            let parametersMetadata = def.length === 0 || !def[0].parametersMetadata ? {} : def[0].parametersMetadata;
                            let analysisLevels = def.length === 0 || !def[0].analysisLevels ? {} : def[0].analysisLevels;
                            definition.parameters = parameters;
                            definition.descriptions = descriptions;
                            definition.parametersMetadata = parametersMetadata;
                            definition.analysisLevels = analysisLevels;
                            definitions[definition.jobDefinitionName][definition.revision] = definition;
                            cb();
                        });
                    }, () => {
                        res.send(definitions);
                    });
                }
            });
        });
    },

    /**
     * Submit Job
     * Inserts a job document into mongo and starts snapshot upload
     * returns job to client
     */
    submitJob(req, res, next) {
        let userId = req.user;
        let job = req.body;

        job.uploadSnapshotComplete = !!job.uploadSnapshotComplete;
        job.analysis = {
            analysisId: uuid.v4(),
            status: 'UPLOADING',
            created: new Date(),
            attempts: 0
        };
        //making consistent with agave ??
        job.appLabel = job.jobName;
        job.appVersion = job.jobDefinition.match(/\d+$/)[0];

        scitran.downloadSymlinkDataset(job.snapshotId, (err, hash) => {
            job.datasetHash = hash;
            job.parametersHash = crypto.createHash('md5').update(JSON.stringify(job.parameters)).digest('hex');

            // jobDefintion is the full ARN including version, region, etc
            c.crn.jobs.findOne({
                jobDefinition:  job.jobDefinition,
                datasetHash:    job.datasetHash,
                parametersHash: job.parametersHash,
                snapshotId:     job.snapshotId
            }, {}, (err, existingJob) => {
                if (err){return next(err);}
                if (existingJob) {
                    // allow retrying failed jobs
                    if (existingJob.analysis && existingJob.analysis.status === 'FAILED') {
                        handlers.retry({params: {jobId: existingJob.jobId}}, res, next);
                        return;
                    }
                    res.status(409).send({message: 'A job with the same dataset and parameters has already been run.'});
                    return;
                }

                c.crn.jobs.insertOne(job, (err, mongoJob) => {

                    // Finish the client request so S3 upload can happen async
                    res.send({jobId: mongoJob.insertedId});

                    // TODO - handle situation where upload to S3 fails
                    aws.s3.uploadSnapshot(hash, () => {
                        const batchJobParams = aws.batch.buildBatchParams(job, hash);

                        aws.batch.startBatchJob(batchJobParams, mongoJob.insertedId, (err) => {
                            if (err) {
                                // This is an unexpected error, probably from batch.
                                console.log(err);
                                // Cleanup the failed to submit job
                                // TODO - Maybe we save the error message into another field for display?
                                c.crn.jobs.updateOne({_id: mongoJob.insertedId}, {$set: {'analysis.status': 'REJECTED'}});
                                return;
                            } else {
                                emitter.emit(events.JOB_STARTED, {job: batchJobParams, createdDate: job.analysis.created}, userId);
                            }
                        });
                    });
                });
            });
        }, {snapshot: true});
    },

    /**
     * GET Job
     */
    getJob(req, res, next) {
        let userId = req.user;
        let jobId = req.params.jobId; //this is the mongo id for the job.

        c.crn.jobs.findOne({_id: ObjectID(jobId)}, {}, (err, job) => {
            if (!job) {
                res.status(404).send({message: 'Job not found.'});
                return;
            }
            let status = job.analysis.status;
            let analysisId = job.analysis.analysisId;
            let jobs = job.analysis.jobs;
            let createdDate = job.analysis.created;

            // check if job is already known to be completed
            // there could be a scenario where we are polling before the AWS batch job has been setup. !jobs check handles this.
            if ((status === 'SUCCEEDED' && job.results && job.results.length > 0) || status === 'FAILED' || status === 'REJECTED' || !jobs || !jobs.length) {
                res.send(job);
            } else {
                let params = {
                    jobs: jobs
                };
                aws.batch.sdk.describeJobs(params, (err, resp) => {
                    if(err) {return next(err);}
                    let analysis = {};
                    let statusArray = resp.jobs.map((job) => {
                        return job.status;
                    });
                    //if every status is either succeeded or failed, all jobs have completed.
                    let finished = statusArray.every((status) => {
                        return status === 'SUCCEEDED' || status === 'FAILED';
                    });

                    analysis.status = !finished ? 'RUNNING' : 'FINALIZING';
                    analysis.created = createdDate;
                    analysis.analysisId = analysisId;
                    // check status
                    if(finished){
                        let logStreamNames; //this will be an array of cloudwatch logstream names logs for each job
                        //Check if any jobs failed, if so analysis failed, else succeeded
                        // note, if statusArray is empty, this means the job does not exist on Batch anymore and we did not catch it's
                        //   pass or fail state for some reason so we are going to call this a failure.
                        let finalStatus = !statusArray.length || statusArray.some((status)=>{ return status === 'FAILED';}) ? 'FAILED' : 'SUCCEEDED';
                        let s3Prefix = job.datasetHash + '/' + job.analysis.analysisId + '/';
                        let params = {
                            Bucket: 'openneuro.outputs',
                            Prefix: s3Prefix,
                            StartAfter: s3Prefix
                        };
                        // emit a job finished event so we can add logs and sent notification email
                        // cloning job here and sending out event and email because mongos updateOne does not return updated doc
                        let clonedJob = JSON.parse(JSON.stringify(job));
                        clonedJob.analysis.status = finalStatus;
                        emitter.emit(events.JOB_COMPLETED, {job: clonedJob, completedDate: new Date()}, userId);
                        notifications.jobComplete(clonedJob);

                        if(resp.jobs && resp.jobs.length > 0) {
                            logStreamNames = resp.jobs.reduce((acc, job) => {
                                if (job.attempts && job.attempts.length > 0) {
                                    job.attempts.forEach((attempt)=> {
                                        acc.push(job.jobName + '/' + job.jobId + '/' + attempt.container.taskArn.split('/').pop());
                                    });
                                }
                                return acc;
                            }, []);
                        }

                        aws.s3.sdk.listObjectsV2(params, (err, data) => {
                            if(err) {return next(err);}

                            let results = [];
                            data.Contents.forEach((obj) => {
                                if(!/\/$/.test(obj.Key)) {
                                    let result = {};
                                    result.name = obj.Key;
                                    result.path = params.Bucket + '/' + obj.Key;
                                    results.push(result);
                                }
                            });
                            //Need to format results to preserver folder structure. this could use some cleanup but works for now
                            let formattedResults = [];
                            let resultStore = {};


                            let nestResultsByPath = (array, store) => {
                                let parent = store[array[0]];
                                let path = parent.dirPath;

                                let checkChildren = (childrenArray, path) => {
                                    return childrenArray.find((child) => {
                                        return child.dirPath === path;
                                    });
                                };

                                array.forEach((level, k) => {
                                    //right now setting up top level before passing in store. can probably change this
                                    if(k === 0) {
                                        parent._id = k;
                                        parent.name = level;
                                        return;
                                    }

                                    path = path + level + (k === array.length-1 ? '': '/'); //last element in array is the filename

                                    let child = checkChildren(parent.children, path);
                                    if(child) {
                                        parent = child;
                                    } else {
                                        child = {
                                            dirPath: path,
                                            children: [],
                                            type: 'folder',
                                            parentId: k-1,
                                            name: level,
                                            _id: k
                                        };
                                        if(k === array.length -1){
                                            delete child.children;
                                            child.type = 'file';
                                            child.path = params.Bucket + '/' + s3Prefix + path;
                                        }
                                        parent.children.push(child);
                                        parent = child;
                                    }
                                });

                                return store;
                            };

                            results.forEach((result) => {
                                let pathArray = result.path.split('/').slice(3);
                                if(pathArray.length === 1) {
                                    resultStore[pathArray[0]] = {
                                        type: 'file',
                                        dirPath: pathArray[0],
                                        name: pathArray[0],
                                        path: result.path
                                    };
                                } else {
                                    if(!resultStore[pathArray[0]]) {
                                        resultStore[pathArray[0]] = {
                                            type: 'folder',
                                            children: [],
                                            name: pathArray[0],
                                            dirPath: pathArray[0] + '/'
                                        };
                                    }
                                    nestResultsByPath(pathArray, resultStore);
                                }
                            });

                            Object.keys(resultStore).forEach((result) => {
                                formattedResults.push(resultStore[result]);
                            });
                            //update job with status, results and logstreams
                            c.crn.jobs.updateOne({_id: ObjectID(jobId)}, {
                                $set:{
                                    'analysis.status': finalStatus,
                                    results: formattedResults,
                                    'analysis.logstreams': logStreamNames
                                }
                            });
                        });
                    } else if(analysis.status != status) {
                        //if status changes, update mongo
                        c.crn.jobs.updateOne({_id: ObjectID(jobId)}, {
                            $set:{
                                'analysis.status': analysis.status
                            }
                        });
                    }
                    res.send({
                        analysis: analysis,
                        jobId: analysisId,
                        datasetId: job.datasetId,
                        snapshotId: job.snapshotId
                    });

                    // notifications.jobComplete(job);

                });
            }
        });
    },

    /**
     * GET File
     * listObjects to find everything in the s3 bucket for a given job
     * stream all files in series(?) to zip
     */
    downloadAllS3(req, res) {
        let jobId = req.params.jobId;

        const path = 'all-results'; //req.ticket.filePath;
        if (path === 'all-results' || path === 'all-logs') {

            const type = path.replace('all-', '');

            // initialize archive
            let archive = archiver('zip');

            // log archiving errors
            archive.on('error', (err) => {
                console.log('archiving error - job: ' + jobId);
                console.log(err);
            });

            c.crn.jobs.findOne({_id: ObjectID(jobId)}, {}, (err, job) => {
                let archiveName = job.datasetLabel + '__' + job.analysis.analysisId + '__' + type;
                let s3Prefix = job.datasetHash + '/' + job.analysis.analysisId + '/';
                //params to list objects for a job
                let params = {
                    Bucket: config.aws.s3.analysisBucket,
                    Prefix: s3Prefix,
                    StartAfter: s3Prefix
                };

                // set archive name
                res.attachment(archiveName + '.zip');

                // begin streaming archive
                archive.pipe(res);

                aws.s3.sdk.listObjectsV2(params, (err, data) => {
                    let keysArray = [];
                    data.Contents.forEach((obj) => {
                        //only include files in results. listObjectsV2 returns keys for directories also so need to filter those out.
                        if(!/\/$/.test(obj.Key)) {
                            keysArray.push(obj.Key);
                        }
                    });

                    async.eachSeries(keysArray, (key, cb) => {
                        let objParams = {
                            Bucket: config.aws.s3.analysisBucket,
                            Key: key
                        };
                        let fileName = key.split('/').slice(2).join('/');
                        aws.s3.sdk.getObject(objParams, (err, response) => {
                            //append to zip
                            archive.append(response.Body, {name: fileName});
                            cb();
                        });
                    }, () => {
                        archive.finalize();
                    });
                });
            });
        }

    },

    getJobLogs (req, res, next) {
        let jobId = req.params.jobId; //this will be the mongoId for a given analysis

        //Recursive function to snag all logs from a logstream
        let logsFunc = (params, logs, callback) => {
            let logStreamName = params.logStreamName;
            aws.cloudwatch.sdk.getLogEvents(params, (err, data)=> {
                if(err) {return callback(err);}
                //Cloudwatch returns a token even if there are no events. That is why checking events length
                if((data.events && data.events.length > 0) && data.nextForwardToken) {
                    if(!logs[logStreamName]) {
                        logs[logStreamName] = [];
                    }
                    logs[logStreamName] = logs[logStreamName].concat(data.events);
                    params.nextToken = data.nextForwardToken;
                    if(params.startFromHead) {
                        delete params.startFromHead; //only necessary on first call I think.
                    }
                    logsFunc(params, logs, callback);
                } else {
                    callback();
                }
            });
        };

        c.crn.jobs.findOne({_id: ObjectID(jobId)}, {}, (err, job) => {
            if(err) {next(err);}
            let logStreamNames = job.analysis.logstreams || [];
            let logs = {};
            //cloudwatch log events requires knowing jobId and taskArn(s)
            // taskArns are available on job which we can access with a describeJobs call to batch
            async.eachSeries(logStreamNames, (logStreamName, cb) => {
                // this currently works to grab the latest logs for a job. Need to update to get all logs for a job using next tokens
                // however there is a bug that will require a little more work to make this happen. https://forums.aws.amazon.com/thread.jspa?threadID=251240&tstart=0
                let params = {
                    logGroupName: config.aws.cloudwatchlogs.logGroupName,
                    logStreamName: logStreamName,
                    startFromHead: true
                };
                logsFunc(params, logs, cb);
            }, (err) =>{
                if(err) {return next(err);}
                res.send(logs);
            });
        });
    },

    /**
     * Retry a job using existing parameters
     */
    retry (req, res, next) {
        let jobId = req.params.jobId;
        let mongoJobId = typeof jobId != 'object' ? ObjectID(jobId) : jobId;

        // find job
        c.crn.jobs.findOne({_id: mongoJobId}, {}, (err, job) => {
            if (err){return next(err);}
            if (!job) {
                let error = new Error('Could not find job.');
                error.http_code = 404;
                return next(error);
            }
            if (job.analysis.status && job.analysis.status === 'SUCCEEDED') {
                let error = new Error('A job with the same dataset and parameters has already successfully finished.');
                error.http_code = 409;
                return next(error);
            }
            if (job.analysis.status && job.analysis.status !== 'FAILED' && job.analysis.status !== 'REJECTED') {
                let error = new Error('A job with the same dataset and parameters is currently running.');
                error.http_code = 409;
                return next(error);
            }

            c.crn.jobs.updateOne({_id: mongoJobId}, {
                $set: {
                    'analysis.status': 'RETRYING',
                    'analysis.jobs': []
                }
            });

            res.send({jobId: mongoJobId});

            const batchJobParams = aws.batch.buildBatchParams(job);

            aws.batch.startBatchJob(batchJobParams, mongoJobId, (err) => {
                if (err) {
                    // This is an unexpected error, probably from batch.
                    console.log(err);
                    // Cleanup the failed to submit job
                    // TODO - Maybe we save the error message into another field for display?
                    c.crn.jobs.updateOne({_id: mongoJobId}, {$set: {'analysis.status': 'REJECTED'}});
                    return;
                } else {
                    emitter.emit(events.JOB_STARTED, {job: batchJobParams, createdDate: job.analysis.created, retry: true});
                }
            });
        });
    }

};

export default handlers;
