/**
 * Provide a configuration object to the React app
 */

// These are public, take care with secrets
const config = {
  url: process.env.CRN_SERVER_URL,

  /**
   * CRN
   */
  crn: {
    url: process.env.CRN_SERVER_URL + '/crn/',
  },

  /**
   * Authentication
   */
  auth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
    },
    orcid: {
      clientID: process.env.ORCID_CLIENT_ID,
      redirectURI: process.env.ORCID_REDIRECT_URI,
      URI: process.env.ORCID_URI,
    },
    globus: {
      clientID: process.env.GLOBUS_CLIENT_ID,
    },
  },

  elasticsearch: {
    cloudID: process.env.ELASTICSEARCH_CLOUD_ID,
  },

  analytics: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

  sentry: {
    environment: process.env.ENVIRONMENT,
  },

  support: {
    url: process.env.FRESH_DESK_URL,
  },

  analysis: {
    enabled: process.env.ANALYSIS_ENABLED,
  },

  github: process.env.DATALAD_GITHUB_ORG,

  publicBucket: process.env.AWS_S3_PUBLIC_BUCKET,

  theme: {},
}

// Provide some environment variables to the client
export const clientConfig = (req, res) => {
  res.send(config)
}
