export default {
  scitran: {
    url: 'localhost:9876/api/',
  },

  /**
   * CRN
   */
  crn: {
    url: 'localhost:9876/crn/',
  },

  /**
   * Authentication
   */
  auth: {
    google: {
      clientID: 'google-client-id',
    },
    orcid: {
      clientID: 'orcid-client-id',
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
  },

  sentry: {
    environment: 'unit-tests',
  },
}
