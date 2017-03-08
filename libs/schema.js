import Ajv from 'ajv';

/**
 * Schema validation middleware
 */
let schema = {

    validateBody(inputSchema) {
        return function (req, res, next) {
            let ajv = new Ajv();
            let validate = ajv.compile(inputSchema);
            let valid    = validate(req.body);

            if (!valid) {
                return res.status(400).send({error: ajv.errorsText(validate.errors)});
            } else {
                return next();
            }
        };
    }

};

export default schema;