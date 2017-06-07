/*eslint no-console: ["error", { allow: ["log"] }] */
import mongo from '../../libs/mongo';
import {ObjectID} from 'mongodb';
import async from 'async';
import config from '../../config';

let c = mongo.collections;

export default (aws) => {

    const cloudwatchlogs = new aws.CloudWatchLogs();

    return {
        sdk: cloudwatchlogs,

        getLogs(logStreamName, logs = [], nextToken = null, callback) {
            let params = {
                logGroupName: config.aws.cloudwatchlogs.logGroupName,
                logStreamName: logStreamName,
            };
            if (logs.length === 0) params.startFromHead = true;
            if (nextToken) params.nextToken = nextToken;
            this.sdk.getLogEvents(params, (err, data)=> {
                if(err) {return callback(err);}
                //Cloudwatch returns a token even if there are no events. That is why checking events length
                if((data.events && data.events.length > 0) && data.nextForwardToken) {
                    logs = logs.concat(data.events);
                    this.getLogs(logStreamName, logs, data.nextForwardToken, callback);
                } else {
                    callback(err, logs);
                }
            });
        },

        getLogsByJobId(jobId, callback) {
            c.crn.jobs.findOne({_id: ObjectID(jobId)}, {}, (err, job) => {
                if(err) {next(err);}
                let logStreamNames = job.analysis.logstreams || [];
                //cloudwatch log events requires knowing jobId and taskArn(s)
                // taskArns are available on job which we can access with a describeJobs call to batch
                async.mapLimit(logStreamNames, 10, (logStreamName, cb) => {
                    // this currently works to grab the latest logs for a job. Need to update to get all logs for a job using next tokens
                    // however there is a bug that will require a little more work to make this happen. https://forums.aws.amazon.com/thread.jspa?threadID=251240&tstart=0
                    this.getLogs(logStreamName, [], null, cb);
                }, (err, logs) => {
                    callback(err, logs);
                });
            });
        }
    };
};
