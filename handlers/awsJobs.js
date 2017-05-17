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
        let jobDef = Object.assign({}, req.body);
        //AWS Batch will choke if we leave descriptions property on payload so deleting before sending
        delete jobDef.descriptions;
        delete jobDef.parametersMetadata;
        delete jobDef.analysisLevels;

        aws.batch.registerJobDefinition(jobDef, (err, data) => {
            if (err) {
                return next(err);
            } else {
                let extendeJobDef = data;
                extendeJobDef.parameters = req.body.parameters || {};
                extendeJobDef.descriptions = req.body.descriptions || {};
                extendeJobDef.parametersMetadata = req.body.parametersMetadata || {};
                extendeJobDef.analysisLevels = req.body.analysisLevels || {};
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
                    let error = new Error('A job with the same dataset and parameters has already been run.');
                    error.http_code = 409;
                    res.status(409).send({message: 'A job with the same dataset and parameters has already been run.'});
                    return;
                }

                c.crn.jobs.insertOne(job, (err, mongoJob) => {

                    // Finish the client request so S3 upload can happen async
                    res.send({jobId: mongoJob.insertedId});

                    // TODO - handle situation where upload to S3 fails
                    aws.s3.uploadSnapshot(hash, () => {
                        const batchJobParams = {
                            jobDefinition: job.jobDefinition,
                            jobName:       job.jobName,
                            jobQueue:      'bids-queue',
                            parameters:    job.parameters,
                            containerOverrides:{
                                environment: [{
                                    name: 'BIDS_SNAPSHOT_ID',
                                    value: hash
                                }, {
                                    name: 'BIDS_ANALYSIS_ID',
                                    value: job.analysis.analysisId
                                }]
                            }
                        };

                        aws.batch.startBatchJob(batchJobParams, mongoJob.insertedId);
                        emitter.emit(events.JOB_STARTED, {job: batchJobParams, createdDate: job.analysis.created});
                    });
                });
            });
        }, {snapshot: true});
    },

    /**
     * GET Job
     */
    getJob(req, res) {
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
            if ((status === 'SUCCEEDED' && job.results && job.results.length > 0) || status === 'FAILED' || !jobs) {
                res.send(job);
            } else {
                let params = {
                    jobs: jobs
                };
                aws.batch.sdk.describeJobs(params, (err, resp) => {
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
                    // check status
                    if(finished){
                        //Check if any jobs failed, if so analysis failed, else succeeded
                        let finalStatus = statusArray.some((status)=>{ return status === 'FAILED';}) ? 'FAILED' : 'SUCCEEDED';
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
                        emitter.emit(events.JOB_COMPLETED, {job: clonedJob, completedDate: new Date()});
                        notifications.jobComplete(clonedJob);

                        aws.s3.sdk.listObjectsV2(params, (err, data) => {
                            let results = [];
                            data.Contents.forEach((obj) => {
                                let result = {};
                                result.name = obj.Key;
                                result.path = params.Bucket + '/' + obj.Key;
                                results.push(result);
                            });
                            c.crn.jobs.updateOne({_id: ObjectID(jobId)}, {
                                $set:{
                                    'analysis.status': finalStatus,
                                    results: results
                                }
                            });
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
                        keysArray.push(obj.Key);
                    });

                    async.eachSeries(keysArray, (key, cb) => {
                        let objParams = {
                            Bucket: config.aws.s3.analysisBucket,
                            Key: key
                        };
                        let fileName = key.split('/')[key.split('/').length - 1]; //get filename from key
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

    /**
     * Retry a job using existing parameters
     */
    retry (req, res, next) {
        // let jobId = req.params.jobId;
        // TODO - This is a stub for testing - need to resubmit using the same CRN job data but a new AWS Batch job
        let error = new Error('Retry is not yet supported.');
        error.http_code = 409;
        return next(error);
    }

};

export default handlers;
