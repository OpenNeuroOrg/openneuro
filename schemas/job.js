const job = {
    title: 'job',
    type:  'object',
    properties: {
        datasetId:     {type: 'string'},
        datasetLabel:  {type: 'string'},
        jobDefinition: {type: 'string'},
        jobName:       {type: 'string'},
        parameters:    {type: 'object'},
        snapshotId:    {type: 'string'},
        userId:        {type: 'string'}
    },
    required: [
        'datasetId',
        'datasetLabel',
        'jobDefinition',
        'jobName',
        'parameters',
        'snapshotId',
        'userId'
    ]
};

export default job;