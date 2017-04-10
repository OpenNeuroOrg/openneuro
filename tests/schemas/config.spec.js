var assert = require('assert');
var schema = require('../../libs/schema');
var configSchema = require('../../schemas/config');

// Dummy configuration that should pass validation
const goodConfig = {
    'url': 'http://localhost:9876',
    'port': 8111,
    'apiPrefix': '/crn/',
    'location': '/srv/crn-server',
    'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'content-type, Authorization'
    },
    'scitran': {
        'url':       'http://nginx:80/api/',
        'secret':    'quaemeeco9uXaiquai4ze6moovahroh8',
        'fileStore': '/srv/bids-core/persistent/data'
    },
    'mongo': {
        'url': 'mongodb://mongo:27017/'
    },
    'aws': {
        'credentials': {
            'accessKeyId': 'JEIHOIJAQU3EET5ONGOF',
            'secretAccessKey': 'eeQuahCeekahwiphoyoe3Do8Maekee9Nedohlese',
            'region': 'us-east-1'
        },
        's3': {
            'bucket': 'test-bucket',
            'concurrency': 10,
            'timeout': 10 * 60 * 1000
        }
    }
};

describe('schemas/config.js', () => {
    describe('test configuration schema validation', () => {
        it('should validate a working configuration', () => {
            let compiledSchema = schema.compileJsonSchema(configSchema);
            assert.ok(compiledSchema);
            let valid = schema.validateJson(compiledSchema, goodConfig);
            if (!valid) {
                throw new Error(schema.getSchemaError(compiledSchema));
            }
            assert.ok(valid);
        });
        it('should fail to validate an empty configuration', () => {
            let compiledSchema = schema.compileJsonSchema(configSchema);
            assert.ok(compiledSchema);
            assert.ok(!schema.validateJson(compiledSchema), {});
        });
        it('should fail to validate config missing aws settings', () => {
            let compiledSchema = schema.compileJsonSchema(configSchema);
            assert.ok(compiledSchema);
            let noAwsConfig = Object.assign({}, goodConfig);
            delete noAwsConfig['aws'];
            assert.ok(!schema.validateJson(compiledSchema, noAwsConfig));
        });
        it('should fail if there are unexpected properties', () => {
            let compiledSchema = schema.compileJsonSchema(configSchema);
            assert.ok(compiledSchema);
            let extraPropConfig = Object.assign({extraConfig: 1234},
                goodConfig);
            assert.ok(!schema.validateJson(compiledSchema, extraPropConfig));
        });
    });
    describe('validateBody()', () => {
        it('should validate the json body of a post request', (done) => {
            let mockReq = {body: goodConfig};
            let mockRes = {};
            let validate = schema.validateBody(configSchema);
            validate(mockReq, mockRes, () => { done(); });
        });
        it('should throw 400 error on invalid json', (done) => {
            let mockReq = {body: {}};
            let mockRes = {
                status: (code) => {
                    // Check for the 400 code
                    assert.equal(code, 400);
                    return {
                        send: (err) => {
                            // Verify an error was returned
                            assert.ok(err);
                            done();
                        }
                    }
                }
            }
            let validate = schema.validateBody(configSchema);
            validate(mockReq, mockRes, () => {
                // Fail if next() is called
                assert.ok(false);
            });
        });
    });
});
