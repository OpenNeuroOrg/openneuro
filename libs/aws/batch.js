/*eslint no-console: ["error", { allow: ["log"] }] */
import mongo from '../../libs/mongo';
import async from 'async';
import config from '../../config';

let c = mongo.collections;

/**
 * Converts a list of job Ids into an array of objects as expected by the Batch API
 */
function _depsObjects(depsIds) {
    return depsIds.map((depId) => {
        return {'jobId': depId};
    });
}

export default (aws) => {

    const batch = new aws.Batch();

    return {
        sdk: batch,

        /**
         * Register a job and store some additional metadata with AWS Batch
         */
        registerJobDefinition(jobDef, callback) {
            if(!this._validateInputs(jobDef)) {
                let err = new Error('Invalid Inputs For AWS Batch');
                err.http_code = 400;
                return callback(err);
            }

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
            c.crn.jobDefinitions.findOne({jobDefinitionArn: batchJob.jobDefinition}, {}, (err, jobDef) => {
                let analysisLevels = jobDef.analysisLevels;
                async.reduce(analysisLevels, [], (deps, level, callback) => {
                    let submitter;
                    let levelName = level.value;
                    if (levelName.search('participant') != -1) {
                        // Run participant level jobs in parallel
                        submitter = this.submitParallelJobs;
                    } else {
                        // Other levels are serial
                        submitter = this.submitSingleJob;
                    }
                    submitter(batchJob, levelName, deps, (err, batchJobIds) => {
                        // Submit the next set of jobs including the previous as deps
                        callback(null, deps.concat(batchJobIds));
                    });
                }, (err, batchJobIds) => {
                    // When all jobs are submitted, update job state with the last set
                    this._updateJobOnSubmitSuccessful(jobId, batchJobIds);
                });
            });
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
        submitParallelJobs(batchJob, level, deps, callback) {
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
                subjectBatchJob.dependsOn = _depsObjects(deps);
                delete subjectBatchJob.parameters.participant_label;
                let env = subjectBatchJob.containerOverrides.environment;
                // TODO - Make BIDS_ANALYSIS_LEVEL configurable for values other than group/participant
                env.push({name: 'BIDS_ANALYSIS_LEVEL', value: level});
                // TODO - Properly escape participant_label subjects and support other parameters
                env.push({name: 'BIDS_ARGUMENTS', value: '--participant_label ' + subject.slice(4)});
                jobs.push(job.bind(this, subjectBatchJob));
            });
            async.parallel(jobs, callback);
        },

        /**
         * Submits a single job to AWS Batch
         * for jobs without a subjectList parameter we are running all subjects in one job.
         * callsback with a single element array containing the AWS batch ID.
         */
        submitSingleJob(batchJob, level, deps, callback) {
            let env = batchJob.containerOverrides.environment;
            // Filter out sub- from sub-01 and convert to space delimited string
            let subjects = batchJob.parameters.participant_label.map((subject) => {
                return subject.slice(4);
            }).join(' ');
            env.push({name: 'BIDS_ANALYSIS_LEVEL', value: level});
            // TODO - prepare the other BIDS_ARGUMENTS from parameters
            env.push({name: 'BIDS_ARGUMENTS', value: '--participant_label ' + subjects});
            // After constructing the parameter, remove invalid object from batch job
            delete batchJob.parameters.participant_label;
            batchJob.dependsOn = _depsObjects(deps);
            batch.submitJob(batchJob, (err, data) => {
                if(err) {callback(err);}
                callback(null, [data.jobId]); //storing jobId's as array in mongo to support multi job analysis
            });
        },

        _validateInputs(jobDef) {
            let vcpusMax = config.aws.batch.vcpusMax;
            let memoryMax = config.aws.batch.memoryMax;

            if(jobDef.containerProperties.vcpus > vcpusMax || jobDef.containerProperties.memory > memoryMax) {
                return false;
            }

            return true;
        }
    };
};
