export const config = {
  /**
   * CRN
   */
  url: 'localhost:9876/crn/',

  graphql: {
    uri: 'http://server:8111',
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

  sentry: {
    environment: 'unit-tests',
  },
}
