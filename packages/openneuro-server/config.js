import schema from './libs/schema'
import configSchema from './schemas/config'

let config = {
  url: process.env.CRN_SERVER_URL,
  port: 8111,
  apiPrefix: '/crn/',
  location: '/srv',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'content-type, Authorization',
  },
  scitran: {
    url: process.env.SCITRAN_SITE_URL,
    secret: process.env.SCITRAN_CORE_DRONE_SECRET,
    fileStore: process.env.SCITRAN_PERSISTENT_DATA_PATH,
  },
  agave: {
    url: process.env.CRN_SERVER_AGAVE_URL,
    username: process.env.CRN_SERVER_AGAVE_USERNAME,
    password: process.env.CRN_SERVER_AGAVE_PASSWORD,
    clientName: process.env.CRN_SERVER_AGAVE_CLIENT_NAME,
    clientDescription: process.env.CRN_SERVER_AGAVE_CLIENT_DESCRIPTION,
    consumerKey: process.env.CRN_SERVER_AGAVE_CONSUMER_KEY,
    consumerSecret: process.env.CRN_SERVER_AGAVE_CONSUMER_SECRET,
    storage: process.env.CRN_SERVER_AGAVE_STORAGE,
  },
  auth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    orcid: {
      clientID: process.env.SCITRAN_AUTH_ORCID_CLIENT_ID,
      clientSecret: process.env.SCITRAN_AUTH_ORCID_CLIENT_SECRET,
      redirectURI: process.env.SCITRAN_AUTH_ORCID_REDIRECT_URI,
      apiURI: process.env.SCITRAN_AUTH_ORCID_API_ENDPOINT,
      URI: process.env.SCITRAN_AUTH_ORCID_URI,
    },
  },
  mongo: {
    url: 'mongodb://mongo:27017/',
  },
  redis: {
    port: 6379,
    host: 'redis',
  },
  notifications: {
    email: {
      service: process.env.CRN_SERVER_MAIL_SERVICE,
      user: process.env.CRN_SERVER_MAIL_USER,
      url: process.env.CRN_SERVER_MAIL_URL,
      pass: process.env.CRN_SERVER_MAIL_PASS,
    },
  },
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      accountId: process.env.AWS_ACCOUNT_ID,
    },
    s3: {
      datasetBucket: process.env.AWS_S3_DATASET_BUCKET,
      analysisBucket: process.env.AWS_S3_ANALYSIS_BUCKET,
      inputsBucket: process.env.AWS_S3_INPUTS_BUCKET,
      concurrency: 10,
      timeout: 10 * 60 * 1000,
    },
    batch: {
      vcpusMax: 12,
      memoryMax: 30720,
      queue: process.env.AWS_BATCH_QUEUE,
      computeEnvironment: process.env.AWS_BATCH_COMPUTE_ENVIRONMENT,
    },
    cloudwatchlogs: {
      logGroupName: '/aws/batch/job',
    },
  },
  events: {
    JOB_STARTED: 'job-started',
    JOB_COMPLETED: 'job-completed',
    DATASET_UPLOADED: 'dataset-uploaded',
  },
  sentry: {
    DSN: process.env.SENTRY_DSN,
    ENVIRONMENT: process.env.ENVIRONMENT,
  },
  datalad: {
    enabled: true,
    uri: 'datalad:9877',
  },
  doi: {
    username: process.env.DOI_USERNAME,
    password: process.env.DOI_PASSWORD,
    prefix: process.env.DOI_PREFIX,
    url: process.env.DOI_URL,
  },
}

let compiledSchema = schema.compileJsonSchema(configSchema)
schema.validateJson(compiledSchema, config)

export default config
