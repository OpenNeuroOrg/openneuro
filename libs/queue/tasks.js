import aws from '../aws';

export default {
    uploadSnapshot: {
        plugins: [ 'jobLock', 'retry' ],
        pluginOptions: {
            jobLock: {},
            retry: {
                retryLimit: 3,
                retryDelay: (1000 * 5),
            }
        },
        perform: function(snapshotHash, callback){
            aws.s3.uploadSnapshot(snapshotHash, callback);
        },
    }
};
