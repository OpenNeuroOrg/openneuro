/**
 * Configuration
 */
export default {
  /**
   * Scitran
   */
  url: process.env.CRN_SERVER_URL,

  scitran: {
    url: process.env.CRN_SERVER_URL + '/api/',
  },

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

  /**
   * Upload
   */
  upload: {
    /**
     * Filenames ignored during upload.
     */
    blacklist: ['.DS_Store', 'Icon\r'],
  },

  /**
   * AWS configuration
   */
  aws: {
    batch: {
      vcpusMax: 12,
      memoryMax: 30720,
    },
    s3: {
      datasetBucket: process.env.AWS_S3_DATASET_BUCKET,
      analysisBucket: process.env.AWS_S3_ANALYSIS_BUCKET,
    },
  },

  analytics: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

  sentry: {
    environment: process.env.ENVIRONMENT,
  },

  datalad: {
    enabled: process.env.CRN_SERVER_DATALAD,
    uri: 'datalad:9877',
  },

  analysis: {
    enabled: process.env.ANALYSIS_ENABLED,
  },
}
