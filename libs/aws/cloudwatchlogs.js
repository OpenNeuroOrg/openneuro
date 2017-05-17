/*eslint no-console: ["error", { allow: ["log"] }] */

export default (aws) => {

    const cloudwatchlogs = new aws.CloudWatchLogs();

    return {
        sdk: cloudwatchlogs
    };
};
