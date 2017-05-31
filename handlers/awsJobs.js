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

//Job Polling

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
        c.crn.jobDefinitions.find({}, {jobDefinitionArn: true}).toArray((err, appDefs) => {
            let arns = appDefs.map((app) => {
                return app.jobDefinitionArn;
            });
            aws.batch.sdk.describeJobDefinitions({jobDefinitions: arns}, (err, data) => {
                if (err) {
                    console.log(err);
                    return next(err);
                } else {
                    let definitions = {};
                    //need to attach job definition descriptions from mongo to job defs returned from AWS batch
                    async.each(data.jobDefinitions, (definition, cb) => {
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
            attempts: 0,
            notification: false
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
                                //server side polling in case client polling stops
                                handlers._pollJob(mongoJob.insertedId, userId);
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
            let jobs = job.analysis.jobs;

            // check if job is already known to be completed
            // there could be a scenario where we are polling before the AWS batch job has been setup. !jobs check handles this.
            if ((status === 'SUCCEEDED' && job.results && job.results.length > 0) || status === 'FAILED' || status === 'REJECTED' || !jobs || !jobs.length) {
                res.send(job);
            } else {
                handlers._getJobStatus(job, userId, (err, data) => {
                    if(err) {return next(err);}
                    res.send(data);
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
    },

    /*
    * Server side polling
    * want to poll jobs at a 5 minute interval in case client side polling stops
    * server side polling is only responsible for sending out notifications and emitting completion event
    * results processing will still occur when client is accessed and polling starts from client
    */
    _pollJob(id, userId) {
        let interval = 300000; // 5 minute interval for server side polling
        let poll = (jobId) => {
            c.crn.jobs.findOne({_id: jobId}, {}, (err, job) => {
                let status = job.analysis.status;
                let finished = status === 'SUCCEEDED' || status === 'FAILED';
                let clonedJob = JSON.parse(JSON.stringify(job));
                //if analysis is finished and notfication has not been sent, send notification.
                if(finished) {
                    handlers._jobComplete(clonedJob, userId);
                } else {
                    handlers._getJobStatus(job, userId, (err, data) => {
                        if(err) {
                            //failing silently here
                            console.log(err);
                            return;
                        }
                        if(!(data.analysis.status === 'SUCCEEDED' || data.analysis.status === 'FAILED')) {
                            setTimeout(poll.bind(this, jobId), interval);
                        }
                    });
                }
            });
        };

        setTimeout(poll.bind(this, id), interval);
    },

    /*
     * Gets jobs for a given analysis from batch, checks overall status and callsback with a snapshot of the analysis status
     */
    _getJobStatus(job, userId, callback) {
        aws.batch.getAnalysisJobs(job, (err, jobs) => {
            if(err) {return callback(err);}
            //check jobs status
            let analysis = {};
            let createdDate = job.analysis.created;
            let analysisId = job.analysis.analysisId;
            let statusArray = jobs.map((job) => {
                return job.status;
            });
            let finished = handlers._checkJobStatus(statusArray);

            analysis.status = !finished ? 'RUNNING' : 'FINALIZING';
            analysis.created = createdDate;
            analysis.analysisId = analysisId;

            if(finished) {
                let finalStatus = !statusArray.length || statusArray.some((status)=>{ return status === 'FAILED';}) ? 'FAILED' : 'SUCCEEDED';
                let logStreams = handlers._buildLogStreams(jobs);

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
                handlers._jobComplete(clonedJob, userId);

                aws.s3.getJobResults(params, (err, results) => {
                    if(err) {return callback(err);}
                    //update job with status, results and logstreams
                    let jobId = typeof job._id === 'object' ? job._id : ObjectID(job._id);
                    c.crn.jobs.updateOne({_id: jobId}, {
                        $set:{
                            'analysis.status': finalStatus,
                            results: results,
                            'analysis.logstreams': logStreams,
                            'analysis.notification': true
                        }
                    });
                });
            } else if(analysis.status != job.analysis.status) {
                let jobId = typeof job._id === 'object' ? job._id : ObjectID(job._id);
                //if status changes, update mongo
                c.crn.jobs.updateOne({_id: jobId}, {
                    $set:{
                        'analysis.status': analysis.status
                    }
                });
            }

            callback(null, {
                analysis: analysis,
                jobId: analysisId,
                datasetId: job.datasetId,
                snapshotId: job.snapshotId
            });
        });
    },

    /*
     * Takes an array of statuses for batch jobs and returns a boolean denoting overall finished state of all jobs
     */
    _checkJobStatus(statusArray) {
        //if every status is either succeeded or failed, all jobs have completed.
        let finished = statusArray.length ? statusArray.every((status) => {
            return status === 'SUCCEEDED' || status === 'FAILED';
        }) : false;

        return finished;
    },

    /*
     * Takes an array of job objects and constructs path to the cloudwatch logstreams
     */
    _buildLogStreams(jobs) {
        let logStreamNames;
        if(jobs && jobs.length > 0) {
            logStreamNames = jobs.reduce((acc, job) => {
                if (job.attempts && job.attempts.length > 0) {
                    job.attempts.forEach((attempt)=> {
                        acc.push(job.jobName + '/' + job.jobId + '/' + attempt.container.taskArn.split('/').pop());
                    });
                }
                return acc;
            }, []);
        }

        return logStreamNames;
    },

    /*
     * Processes job complete tasks (notifications and event emit)
     */
    _jobComplete(job, userId) {
        if(!job.analysis.notification) {
            emitter.emit(events.JOB_COMPLETED, {job: job, completedDate: new Date()}, userId);
            notifications.jobComplete(job);
            let jobId = typeof job._id === 'object' ? job._id : ObjectID(job._id);
            c.crn.jobs.updateOne({_id: jobId}, {
                $set:{
                    'analysis.notification': true
                }
            });
        }
    }

};

export default handlers;
