/**
 * Provide a configuration object to the React app
 */

// These are public, take care with secrets
const config = {
  CRN_SERVER_URL: process.env.CRN_SERVER_URL,
  GRAPHQL_URI: process.env.GRAPHQL_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GLOBUS_CLIENT_ID: process.env.GLOBUS_CLIENT_ID,
  ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
  ORCID_API_ENDPOINT: process.env.ORCID_API_ENDPOINT,
  GOOGLE_TRACKING_IDS: process.env.GOOGLE_TRACKING_IDS,
  ENVIRONMENT: process.env.ENVIRONMENT,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SUPPORT_URL: process.env.FRESH_DESK_URL,
  DATALAD_GITHUB_ORG: process.env.DATALAD_GITHUB_ORG,
  AWS_S3_PUBLIC_BUCKET: process.env.AWS_S3_PUBLIC_BUCKET,
}

// Provide some environment variables to the client
export const clientConfig = (req, res) => {
  const configScript = `window.OpenNeuroConfig = ${JSON.stringify(config)}`
  res.type("text/javascript").send(configScript)
}
