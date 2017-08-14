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
        parameters: {type: 'object'},
        type: {type: 'string'},
        descriptions: {type: 'object'},
        parametersMetadata: {type: 'object'},
        analysisLevels: {type: 'array'}
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
                    minimum: 0
                },
                vcpus: {
                    type: 'integer',
                    minimum: 1
                },
                environment: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            },
                            value: {
                                type: 'string'
                            }
                        },
                        required: [
                            'name',
                            'value'
                        ],
                        additionalItems: false,
                        uniqueItems: true
                    },
                    minItems: 0
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
        'parameters',
        'type',
        'descriptions',
        'parametersMetadata',
        'analysisLevels'
    ],
    additionalProperties: false
};

export default {submit, definition};
