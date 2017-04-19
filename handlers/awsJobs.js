// dependencies ------------------------------------------------------------

import aws     from '../libs/aws';
import scitran from '../libs/scitran';
import mongo         from '../libs/mongo';

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

        c.crn.jobs.insertOne(job, (err, mongoJob) => {
            scitran.downloadSymlinkDataset(job.snapshotId, (err, hash) => {
                aws.s3.uploadSnapshot(hash, () => {
                    handlers.startBatchJob(batchJobParams, mongoJob.insertedId);
                });
            }, {snapshot: true});
            res.send({jobId: mongoJob.insertedId}); // what do I want to return here??  
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
           c.crn.jobs.updateOne({_id: jobId}, {$set:{awsBatchJobId: data.jobId, uploadSnapshotComplete: true}}, (err, doc) => {
            //error handling???
           });
        });
    }

};

export default handlers;
