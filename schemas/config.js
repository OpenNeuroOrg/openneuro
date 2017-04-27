const config = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'config',
    type:  'object',
    properties: {
        url: {type: 'string'},
        port: {type: 'integer'},
        apiPrefix: {type: 'string'},
        location: {type: 'string'},
        headers: {type: 'object'},
        scitran: {type: 'object'},
        agave: {type: 'object'},
        mongo: {type: 'object'},
        notifications: {type: 'object'},
        aws: {
            type: 'object',
            properties: {
                credentials: {
                    type: 'object',
                    properties: {
                        accessKeyId: {type: 'string'},
                        secretAccessKey: {type: 'string'},
                        region: {type: 'string'}
                    }
                },
                s3: {
                    type: 'object',
                    properties: {
                        datasetBucket: {type: 'string', minLength: 1},
                        analysisBucket: {type: 'string', minLength: 1},
                        concurrency: {type: 'integer', minimum: 1},
                        timeout: {type: 'integer'}
                    },
                    required: [
                        'datasetBucket',
                        'analysisBucket'
                    ]
                }
            },
            required: [
                'credentials',
                's3'
            ]
        }
    },
    required: [
        'url',
        'port',
        'apiPrefix',
        'location',
        'scitran',
        'mongo',
        'aws'
    ],
    additionalProperties: false
};

export default config;
