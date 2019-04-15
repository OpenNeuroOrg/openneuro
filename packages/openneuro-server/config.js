const config = {
  url: process.env.CRN_SERVER_URL,
  port: 8111,
  apiPrefix: '/crn/',
  location: '/srv',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'content-type, Authorization',
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
    jwt: {
      secret: process.env.JWT_SECRET,
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

export default config
