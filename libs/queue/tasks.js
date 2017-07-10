/*eslint no-console: ["error", { allow: ["log"] }] */

import aws from '../aws';

export default {
    startAnalysis: {
        perform: (options, callback) => {
            console.log('Starting analysis %s', JSON.stringify(options));
            aws.batch.startAnalysis(options.job, options.jobId, options.userId, callback);
        }
    }
};
