import schema from './libs/schema'
import configSchema from './schemas/config'

let config = {
  url: process.env.CRN_SERVER_URL,
  port: 8111,
  apiPrefix: '/crn/',
  location: '/srv/crn-server',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'content-type, Authorization',
  },
  scitran: {
    url: process.env.SCITRAN_URL,
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
      pass: process.env.CRN_SERVER_MAIL_PASS,
    },
  },
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
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
      memoryMax: 15360,
      queue: process.env.AWS_BATCH_QUEUE,
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
}

let compiledSchema = schema.compileJsonSchema(configSchema)
schema.validateJson(compiledSchema, config)

export default config
