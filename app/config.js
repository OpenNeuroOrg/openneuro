/**
 * Configuration
 */
export default {
  /**
		 * Scitran
		 */
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
      clientID: process.env.SCITRAN_AUTH_CLIENT_ID,
    },
    orcid: {
      clientID: process.env.ORCID_AUTH_CLIENT_ID,
      redirectURI: process.env.ORCID_AUTH_REDIRECT_URI,
      URI: process.env.ORCID_URI,
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
      memoryMax: 15360,
    },
  },

  analytics: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

  sentry: {
    environment: process.env.ENVIRONMENT,
  },
}
