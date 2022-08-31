// @ts-nocheck

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
  url: import.meta.env.VITE_CRN_SERVER_URL,
  api: `${import.meta.env.VITE_CRN_SERVER_URL as string}/crn/`,
  graphql: {
    uri: import.meta.env.VITE_GRAPHQL_URI,
  },
  auth: {
    google: {
      clientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    },
    globus: {
      clientID: import.meta.env.VITE_GLOBUS_CLIENT_ID,
    },
    orcid: {
      clientID: import.meta.env.VITE_ORCID_CLIENT_ID,
      URI: import.meta.env.VITE_ORCID_URI,
      redirectURI: import.meta.env.VITE_ORCID_REDIRECT_URI,
    },
  },
  analytics: {
    trackingIds:
      import.meta.env.VITE_GOOGLE_TRACKING_IDS &&
      import.meta.env.VITE_GOOGLE_TRACKING_IDS.split(',').map(id => {
        return id.trim() as string
      }),
  },
  sentry: { environment: import.meta.env.VITE_ENVIRONMENT },
  support: { url: import.meta.env.VITE_SUPPORT_URL },
  github: import.meta.env.VITE_DATALAD_GITHUB_ORG,
  publicBucket: import.meta.env.VITE_AWS_S3_PUBLIC_BUCKET,
  ELASTIC_APM_SERVER_URL: import.meta.env.VITE_ELASTIC_APM_SERVER_URL,
}

export const getConfig = (): OpenNeuroConfig => config
