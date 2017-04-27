var assert = require('assert');
var schema = require('../../libs/schema');
var configSchema = require('../../schemas/config');
var goodConfig = require('../data/goodConfig');

describe('schemas/config.js', () => {
    describe('test configuration schema validation', () => {
        it('should validate a working configuration', () => {
            let compiledSchema = schema.compileJsonSchema(configSchema);
            assert.ok(compiledSchema);
            let valid = schema.validateJson(compiledSchema, goodConfig);
            if (!valid) {
                throw new Error(compiledSchema.errors);
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
});
