// dependencies ------------------------------------------------------------

import aws     from '../libs/aws';
import scitran from '../libs/scitran';
import crypto  from 'crypto';
import uuid    from 'uuid';
import mongo         from '../libs/mongo';
import {ObjectID}    from 'mongodb';

let c = mongo.collections;

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
        let jobDef = req.body;

        aws.batch.sdk.registerJobDefinition(jobDef, (err, data) => {
            if (err) {
                return next(err);
            } else {
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
        aws.batch.sdk.describeJobDefinitions({}, (err, data) => {
            if (err) {
                return next(err);
            } else {
                let definitions = {};
                for (let definition of data.jobDefinitions) {
                    if (!definitions.hasOwnProperty(definition.jobDefinitionName)) {
                        definitions[definition.jobDefinitionName] = {};
                    }
                    definitions[definition.jobDefinitionName][definition.revision] = definition;
                }

                res.send(definitions);
            }
        });
    },

    /**
     * Submit Job
     * Inserts a job document into mongo and starts snapshot upload
     * returns job to client
     */
    submitJob(req, res, next) {
        let job = req.body;

        const batchJobParams = {
            jobDefinition: job.jobDefinition,
            jobName:       job.jobName,
            jobQueue:      'bids-queue',
            parameters:    job.parameters
        };

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
                jobDefinition:  job.jobDefintion,
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
                    res.send({analysisId: job.analysis.analysisId});

                    // TODO - handle situation where upload to S3 fails
                    aws.s3.uploadSnapshot(hash, () => {
                        handlers.startBatchJob(batchJobParams, mongoJob.insertedId);
                    });
                });
            });
        }, {snapshot: true});
    },

    /**
     * Start AWS Batch Job
     * starts an aws batch job
     * returns no return. Batch job start is happening after response has been send to client
     */
    startBatchJob(params, jobId) {
        aws.batch.sdk.submitJob(params, (err, data) => {
            //update mongo job with aws batch job id?
            c.crn.jobs.updateOne({_id: jobId}, {
                $set:{
                    // jobId: data.jobId,
                    analysis:{
                        status: 'PENDING', //setting status to pending as soon as job submissions is successful
                        attempts: 1,
                        jobs: data.jobId // Should be an array of AWS ids for each AWS batch job
                    },
                    uploadSnapshotComplete: true
                }
            }, () => {
            //error handling???
            });
        });
    },

        /**
     * GET Job
     */
    getJob(req, res) {
        let jobId = req.params.jobId; //this is the mongo id for the job.

        c.crn.jobs.findOne({_id: ObjectID(jobId)}, {}, (err, job) => {
            let status = job.analysis.status;
            let analysisId = job.analysis.analysisId;
            // check if job is already known to be completed
            // there could be a scenario where we are polling before the AWS batch job has been setup. !analysisId check handles this.
            if ((status === 'SUCCEEDED' && job.results && job.results.length > 0) || status === 'FAILED' || !analysisId) {
                res.send(job);
            } else {
                let params = {
                    jobs: [analysisId]
                };
                aws.batch.sdk.describeJobs(params, (err, resp) => {
                    let analysis = resp.jobs[0];
                    // check status
                    if(analysis.status === 'SUCCEEDED' || analysis.status === 'FAILED'){
                        let params = {
                            Bucket: 'openneuro.outputs',
                            Prefix: '24fd3a7f24ce267eb488ec5afe5c98c1'
                        };
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
                                    'analysis.status': analysis.status,
                                    results: results
                                }
                            });
                        });
                    }
                    res.send({
                        analysis: analysis,
                        jobId: jobId,
                        datasetId: job.datasetId,
                        snapshotId: job.snapshotId
                    });

                    // notifications.jobComplete(job);

                    // if (resp.body.status === 'error' && resp.body.message.indexOf('No job found with job id') > -1) {
                    //     job.agave.status = 'FAILED';
                    //     c.crn.jobs.updateOne({jobId}, {$set: {agave: job.agave}}, {}, () => {
                    //         res.send({agave: resp.body.result, snapshotId: job.snapshotId});
                    //         notifications.jobComplete(job);
                    //     });
                    // } else if (resp.body && resp.body.result && (resp.body.result.status === 'FINISHED' || resp.body.result.status === 'FAILED')) {
                    //     job.agave = resp.body.result;
                    //     agave.getOutputs(jobId, (results, logs) => {
                    //         c.crn.jobs.updateOne({jobId}, {$set: {agave: resp.body.result, results, logs}}, {}, (err) => {
                    //             if (err) {res.send(err);}
                    //             else {res.send({agave: resp.body.result, results, logs, snapshotId: job.snapshotId});}
                    //             job.agave = resp.body.result;
                    //             job.results = results;
                    //             job.logs = logs;
                    //             if (status !== 'FINISHED') {notifications.jobComplete(job);}
                    //         });
                    //     });
                    // } else if (resp.body && resp.body.result && job.agave.status !== resp.body.result.status) {
                    //     job.agave = resp.body.result;
                    //     c.crn.jobs.updateOne({jobId}, {$set: {agave: resp.body.result}}, {}, (err) => {
                    //         if (err) {res.send(err);}
                    //         else {
                    //             res.send({
                    //                 agave:      resp.body.result,
                    //                 datasetId:  job.datasetId,
                    //                 snapshotId: job.snapshotId,
                    //                 jobId:      jobId
                    //             });
                    //         }
                    //     });
                    // } else {
                    //     res.send({
                    //         agave:      resp.body.result,
                    //         datasetId:  job.datasetId,
                    //         snapshotId: job.snapshotId,
                    //         jobId:      jobId
                    //     });
                    // }
                });
            }
        });
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
