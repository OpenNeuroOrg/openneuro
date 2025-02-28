// Base class for all CLI specific errors
export class OpenNeuroCLIError extends Error {}
// Login is required before this step
export class LoginError extends OpenNeuroCLIError {}
// GraphQL query failed due to a network error
export class QueryError extends OpenNeuroCLIError {}
// Options provided are invalid
export class OptionError extends OpenNeuroCLIError {}
// GraphQL response failed due to an internal error
export class ResponseError extends QueryError {}
// Expected errors for createDatasetAffirmed
export class CreateDatasetAffirmedError extends OpenNeuroCLIError {}
