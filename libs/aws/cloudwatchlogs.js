/*eslint no-console: ["error", { allow: ["log"] }] */
import mongo from '../../libs/mongo';
import {ObjectID} from 'mongodb';
import mapValuesLimit from 'async/mapValuesLimit';
import config from '../../config';

let c = mongo.collections;

export default (aws) => {

    const cloudwatchlogs = new aws.CloudWatchLogs();

    return {
        sdk: cloudwatchlogs,

        /**
         * Get all logs given a logStreamName or continue from nextToken
         * callback(err, logs) returns logs as an array
         */
        getLogs(logStreamName, logs = [], nextToken = null, callback) {
            let params = {
                logGroupName: config.aws.cloudwatchlogs.logGroupName,
                logStreamName: logStreamName
            };
            if (logs.length === 0) params.startFromHead = true;
            if (nextToken) params.nextToken = nextToken;
            // cloudwatch log events requires knowing jobId and taskArn(s)
            // taskArns are available on job which we can access with a describeJobs call to batch
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

        /**
         * Given a jobId, get all logs for any subtasks and return useful
         * metadata along with the log lines
         */
        getLogsByJobId(jobId, callback) {
            c.crn.jobs.findOne({_id: ObjectID(jobId)}, {}, (err, job) => {
                if(err) {callback(err);}
                let logStreamNames = job.analysis.logstreams || [];
                let logStreams = logStreamNames.reduce((streams, ls, index) => {
                    if (ls instanceof Object) {
                        streams[ls.name] = ls;
                    } else {
                        // This handles the old logstream format
                        streams[ls] = {name: ls, environment: null, exitCode: null};
                    }
                    return streams;
                }, {});
                mapValuesLimit(logStreams, 10, (params, logStreamName, cb) => {
                    this.getLogs(logStreamName, [], null, this._includeJobParams(params, cb));
                }, (err, logs) => {
                    callback(err, logs);
                });
            });
        },

        /**
         * Adapter for getLogs callback values to object with metadata
         */
        _includeJobParams(params, callback) {
            return (err, logs) => {
                let logsObj = {...params, logs};
                callback(err, logsObj);
            }
        }
    };
};
