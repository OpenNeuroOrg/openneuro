/*eslint no-console: ["error", { allow: ["log"] }] */
import mongo from '../../libs/mongo';
import async from 'async';
import config from '../../config';

let c = mongo.collections;

export default (aws) => {

    const cloudwatchlogs = new aws.CloudWatchLogs();

    return {
        sdk: cloudwatchlogs
    };
};
