// dependencies ------------------------------------------------------------

import aws     from '../libs/aws';
import scitran from '../libs/scitran';
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
    submitJob(req, res) {
        let job = req.body;

        const batchJobParams = {
            jobDefinition: job.jobDefinition,
            jobName:       job.jobName,
            parameters:    job.parameters
        };
        batchJobParams.jobQueue = 'bids-queue';

        job.uploadSnapshotComplete = !!job.uploadSnapshotComplete;
        job.analysis = {
            status: 'PENDING'
        };

        c.crn.jobs.insertOne(job, (err, mongoJob) => {
            scitran.downloadSymlinkDataset(job.snapshotId, (err, hash) => {
                aws.s3.uploadSnapshot(hash, () => {
                    handlers.startBatchJob(batchJobParams, mongoJob.insertedId);
                });
            }, {snapshot: true});
            res.send({jobId: mongoJob.insertedId});
        });
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
                    analysis:{
                        analysisId: data.jobId,
                        status: 'PENDING', //setting status to pending as soon as job submissions is successful
                        attempts: 1
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
            let analysisId = job.analysis.analysisId; //there could be a scenario where we are polling before the AWS batch job has been setup.  Need to handle this.
            // check if job is already known to be completed
            if ((status === 'SUCCEEDED' && job.results && job.results.length > 0) || status === 'FAILED') {
                res.send(job);
            } else {
                let params = {
                    jobs: [analysisId]
                };
                aws.batch.sdk.describeJobs(params, (err, resp) => {
                    let analysis = resp.jobs[0];
                    // check status
                    if(analysis.status === 'SUCCEEDED' || analysis.status === 'FAILED'){
                        c.crn.jobs.updateOne({_id: ObjectID(jobId)}, {
                            $set:{
                                'analysis.status': analysis.status,
                                results: [1]
                            }
                        });
                    }
                    res.send({
                        analysis: analysis,
                        jobId: jobId,
                        datasetId: job.datasetId,
                        snapshotId: job.snapshotId
                    });

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
    }

};

export default handlers;
