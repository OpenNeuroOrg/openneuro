/*eslint no-console: ["error", { allow: ["log"] }] */
import mongo from '../../libs/mongo';
import async from 'async';
import config from '../../config';

let c = mongo.collections;

export default (aws) => {

    const batch = new aws.Batch();

    return {
        sdk: batch,

        /**
         * Register a job and store some additional metadata with AWS Batch
         */
        registerJobDefinition(jobDef, callback) {
            let env = jobDef.containerProperties.environment;
            env.push({name: 'BIDS_DATASET_BUCKET', value: config.aws.s3.datasetBucket});
            env.push({name: 'BIDS_OUTPUT_BUCKET', value: config.aws.s3.analysisBucket});
            // This controls this value for the host container
            // child containers are always run without the privileged flag
            jobDef.containerProperties.privileged = true;
            batch.registerJobDefinition(jobDef, callback);
        },

        /**
         * Start AWS Batch Job
         * starts an aws batch job
         * returns no return. Batch job start is happening after response has been send to client
         */
        startBatchJob(batchJob, jobId) {
            //check for subject list and make decision regarding job execution (i.e. one job or multiple, parallel jobs)
            if(batchJob.parameters.hasOwnProperty('participant_label') && batchJob.parameters.participant_label instanceof Array) {
                this.submitParallelJobs(batchJob, (err, data) => {
                    // need to handle error
                    this._updateJobOnSubmitSuccessful(jobId, data);
                });
            } else {
                this.submitSingleJob(batchJob, (err, data) => {
                    // need to handle error
                    this._updateJobOnSubmitSuccessful(jobId, data);
                });
            }
        },

        /**
         * Update mongo job on successful job submission to AWS Batch.
         * returns no return. Batch job start is happening after response has been send to client
         */
        _updateJobOnSubmitSuccessful(jobId, batchIds) {
            c.crn.jobs.updateOne({_id: jobId}, {
                $set:{
                    'analysis.status': 'PENDING', //setting status to pending as soon as job submissions is successful
                    'analysis.attempts': 1,
                    'analysis.jobs': batchIds, // Should be an array of AWS ids for each AWS batch job
                    uploadSnapshotComplete: true
                }
            }, () => {
            //error handling???
            });
        },

        /**
         * Submit parallel jobs to AWS batch
         * for jobs with a subjectList parameter, we want to start all those jobs in parallel
         * submits all jobs in parallel and callsback with an array of the AWS batch ids for all the jobs
         */
        submitParallelJobs(batchJob, callback) {
            let job = (params, callback) => {
                batch.submitJob(params, (err, data) => {
                    if(err) {callback(err);}
                    //pass the AWS batch job ID
                    let jobId = data.jobId;
                    callback(null, jobId);
                });
            };

            let jobs = [];

            batchJob.parameters.participant_label.forEach((subject) => {
                let subjectBatchJob = JSON.parse(JSON.stringify(batchJob));
                delete subjectBatchJob.parameters.participant_label;
                let env = subjectBatchJob.containerOverrides.environment;
                // TODO - Make BIDS_ANALYSIS_LEVEL configurable for values other than group/participant
                env.push({name: 'BIDS_ANALYSIS_LEVEL', value: 'participant'});
                // TODO - Properly escape participant_label subjects and support other parameters
                env.push({name: 'BIDS_ARGUMENTS', value: '--participant_label ' + subject});
                jobs.push(job.bind(this, subjectBatchJob));
            });
            async.parallel(jobs, callback);
        },

        /**
         * Submits a single job to AWS Batch
         * for jobs without a subjectList parameter we are running all subjects in one job.
         * callsback with a single element array containing the AWS batch ID.
         */
        submitSingleJob(batchJob, callback) {
            // TODO - BIDS_ANALYSIS_LEVEL should be handled elsewhere
            // Value is not always "group" for group analysis
            batchJob.containerOverrides.environment.push({name: 'BIDS_ANALYSIS_LEVEL', value: 'group'});
            batch.submitJob(batchJob, (err, data) => {
                if(err) {callback(err);}
                callback(null, [data.jobId]); //storing jobId's as array in mongo to support multi job analysis
            });
        }
    };
};
