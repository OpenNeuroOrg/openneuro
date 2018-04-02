import Ajv from 'ajv'

/**
 * Schema validation middleware and helper functions
 */
let schema = {
  compileJsonSchema(inputSchema) {
    let ajv = new Ajv()
    return ajv.compile(inputSchema)
  },

  validateJson(compiledSchema, jsonBody) {
    return compiledSchema(jsonBody)
  },

  validateBody(inputSchema) {
    return function(req, res, next) {
      let compiledSchema = schema.compileJsonSchema(inputSchema)
      let valid = schema.validateJson(compiledSchema, req.body)
      if (!valid) {
        return res.status(400).send({ error: compiledSchema.errors })
      } else {
        return next()
      }
    }
  },
}

export default schema
