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
      ORCID_API_ENDPOINT: string
    }
    globus?: {
      clientID: string
    }
  }
  analytics?: { trackingIds: string }
  sentry?: {
    environment: string
    dsn: string
  }
  support?: {
    url: string
  }
  github?: string
  publicBucket?: string
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
      ORCID_API_ENDPOINT: globalThis.OpenNeuroConfig.ORCID_API_ENDPOINT,
    },
  },
  analytics: {
    trackingIds: globalThis.OpenNeuroConfig.GOOGLE_TRACKING_IDS.split(",").map(
      (id) => {
        return id.trim() as string
      },
    ),
  },
  sentry: {
    environment: globalThis.OpenNeuroConfig.ENVIRONMENT,
    dsn: globalThis.OpenNeuroConfig.SENTRY_DSN,
  },
  support: { url: globalThis.OpenNeuroConfig.SUPPORT_URL },
  github: globalThis.OpenNeuroConfig.DATALAD_GITHUB_ORG,
  publicBucket: globalThis.OpenNeuroConfig.AWS_S3_PUBLIC_BUCKET,
}

export const getConfig = (): OpenNeuroConfig => config
