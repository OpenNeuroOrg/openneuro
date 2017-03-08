const job = {
    title: 'job',
    type:  'object',
    properties: {
        jobDefinitionArn:  {type: 'string'},
        jobDefinitionName: {type: 'string'},
        jobRevision:       {type: 'integer', minimum: 1},
        datasetId:         {type: 'string'},
        datasetLabel:      {type: 'string'},
        parameters:        {type: 'object'},
        snapshotId:        {type: 'string'},
        userId:            {type: 'string'}
    },
    required: [
        'jobDefinitionArn',
        'jobDefinitionName',
        'jobRevision',
        'datasetId',
        'datasetLabel',
        'parameters',
        'snapshotId',
        'userId'
    ]
};

export default job;