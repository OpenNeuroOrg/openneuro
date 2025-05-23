const config = {
  url: process.env.CRN_SERVER_URL,
  port: 8111,
  apiPrefix: "/crn/",
  location: "/srv",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "content-type, Authorization",
  },
  analysis: {
    enabled: process.env.ANALYSIS_ENABLED,
  },
  auth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    orcid: {
      clientID: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
      redirectURI: process.env.ORCID_REDIRECT_URI,
      apiURI: process.env.ORCID_API_ENDPOINT,
      URI: process.env.ORCID_URI,
    },
    globus: {
      clientID: process.env.GLOBUS_CLIENT_ID,
      clientSecret: process.env.GLOBUS_CLIENT_SECRET,
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  },
  mongo: {
    url: process.env.MONGO_URL,
    dbName: "crn",
    connectTimeoutMS: 1000,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  },
  notifications: {
    email: {
      apiKey: process.env.CRN_SERVER_MAIL_API_KEY,
      secret: process.env.CRN_SERVER_MAIL_API_SECRET,
      from: process.env.CRN_SERVER_MAIL_FROM,
    },
  },
  sentry: {
    DSN: process.env.SENTRY_DSN,
    ENVIRONMENT: process.env.ENVIRONMENT,
  },
  datalad: {
    uri: process.env.DATALAD_SERVICE_URI,
    workers: process.env.DATALAD_WORKERS,
  },
  doi: {
    username: process.env.DOI_USERNAME,
    password: process.env.DOI_PASSWORD,
    prefix: process.env.DOI_PREFIX,
    url: process.env.DOI_URL,
  },
  elasticsearch: {
    connection: process.env.ELASTICSEARCH_CONNECTION,
    apmServerUrl: process.env.ELASTIC_APM_SERVER_URL,
    apmApiKey: process.env.ELASTIC_APM_API_KEY,
  },
  github: {
    token: process.env.DATALAD_GITHUB_TOKEN,
  },
}

export default config
