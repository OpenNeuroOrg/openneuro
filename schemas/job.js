const submit = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'job-submission',
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
    ],
    additionalProperties: false
};

const definition = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'job-definition',
    type: 'object',
    properties: {
        jobDefinitionName: {type: 'string'},
        containerProperties: {$ref: '#/definitions/containerProperties'},
        parameters: {type: 'object'}
    },
    definitions: {
        containerProperties: {
            properties: {
                image: {type: 'string'},
                command: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    minItems: 0
                },
                memory: {
                    type: 'integer',
                    minimum: 0,
                },
                vcpus: {
                    type: 'integer',
                    minimum: 1
                }
            },
            required: [
                'image',
                'command',
                'memory',
                'vcpus'
            ],
            additionalProperties: false
        }
    },
    required: [
        'jobDefinitionName',
        'containerProperties',
        'parameters'
    ],
    additionalProperties: false
};

export default {submit, definition};