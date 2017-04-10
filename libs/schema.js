import Ajv from 'ajv';

/**
 * Schema validation middleware and helper functions
 */
let schema = {

    compileJsonSchema(inputSchema) {
        let ajv = new Ajv();
        return ajv.compile(inputSchema);
    },

    validateJson(compiledSchema, jsonBody) {
        return compiledSchema(jsonBody);
    },

    getSchemaError(compiledSchema) {
        let ajv = new Ajv();
        return ajv.errorsText(compiledSchema.errors);
    },

    validateBody(inputSchema) {
        return function (req, res, next) {
            let compiledSchema = schema.compileJsonSchema(inputSchema);
            let valid = schema.validateJson(compiledSchema, req.body);
            if (!valid) {
                return res.status(400).send({error: schema.getSchemaError(valid)});
            } else {
                return next();
            }
        };
    }

};

export default schema;
