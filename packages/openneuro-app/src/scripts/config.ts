/**
 * Interface describing the configuration object
 */
export interface OpenNeuroConfig {
  url: string
  api: string
  graphql: {
    uri: string
  }
  auth: {
    google?: {
      clientID: string
    }
    orcid?: {
      clientID: string
      URI: string
      redirectURI: string
    }
    globus?: {
      clientID: string
    }
  }
  analytics?: { trackingIds: string }
  sentry?: { environment: string }
  support?: {
    url: string
  }
  github?: string
  publicBucket?: string
  ELASTIC_APM_SERVER_URL?: string
}

export const config: OpenNeuroConfig = {
  url: globalThis.OpenNeuroConfig.CRN_SERVER_URL,
  api: `${globalThis.OpenNeuroConfig.CRN_SERVER_URL as string}/crn/`,
  graphql: {
    uri: globalThis.OpenNeuroConfig.GRAPHQL_URI,
  },
  auth: {
    google: {
      clientID: globalThis.OpenNeuroConfig.GOOGLE_CLIENT_ID,
    },
    globus: {
      clientID: globalThis.OpenNeuroConfig.GLOBUS_CLIENT_ID,
    },
    orcid: {
      clientID: globalThis.OpenNeuroConfig.ORCID_CLIENT_ID,
      URI: globalThis.OpenNeuroConfig.ORCID_URI,
      redirectURI: globalThis.OpenNeuroConfig.ORCID_REDIRECT_URI,
    },
  },
  analytics: {
    trackingIds: globalThis.OpenNeuroConfig.GOOGLE_TRACKING_IDS.split(',').map(
      id => {
        return id.trim() as string
      },
    ),
  },
  sentry: { environment: globalThis.OpenNeuroConfig.ENVIRONMENT },
  support: { url: globalThis.OpenNeuroConfig.SUPPORT_URL },
  github: globalThis.OpenNeuroConfig.DATALAD_GITHUB_ORG,
  publicBucket: globalThis.OpenNeuroConfig.AWS_S3_PUBLIC_BUCKET,
  ELASTIC_APM_SERVER_URL: globalThis.OpenNeuroConfig.ELASTIC_APM_SERVER_URL,
}

export const getConfig = (): OpenNeuroConfig => config
