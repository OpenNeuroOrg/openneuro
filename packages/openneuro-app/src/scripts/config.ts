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
}

// TypeScript errors here are due to Vite transforming import.meta.env.
// Vite requires the full name to be maintained (can't dereference it)
export const config: OpenNeuroConfig = {
  // @ts-expect-error Vite
  url: import.meta.env.VITE_CRN_SERVER_URL.toString(),
  // @ts-expect-error Vite
  api: import.meta.env.VITE_API.toString(),
  graphql: {
    // @ts-expect-error Vite
    uri: import.meta.env.VITE_GRAPHQL_URI.toString(),
  },
  auth: {
    // @ts-expect-error Vite
    google: { clientID: import.meta.env.VITE_GOOGLE_CLIENT_ID.toString() },
    // @ts-expect-error Vite
    globus: { clientID: import.meta.env.VITE_GLOBUS_CLIENT_ID.toString() },
    orcid: {
      // @ts-expect-error Vite
      clientID: import.meta.env.VITE_ORCID_CLIENT_ID.toString(),
      // @ts-expect-error Vite
      URI: import.meta.env.VITE_ORCID_URI.toString(),
      // @ts-expect-error Vite
      redirectURI: import.meta.env.VITE_ORCID_REDIRECT_URI.toString(),
    },
  },
  analytics: {
    // @ts-expect-error Vite
    trackingIds: import.meta.env.GOOGLE_TRACKING_IDS.split(',').map(id => {
      return id.trim() as string
    }),
  },
  // @ts-expect-error Vite
  sentry: { environment: import.meta.env.VITE_ENVIRONMENT.toString() },
  // @ts-expect-error Vite
  support: { url: import.meta.env.VITE_SUPPORT_URL.toString() },
  // @ts-expect-error Vite
  github: import.meta.env.VITE_DATALAD_GITHUB_ORG.toString(),
  // @ts-expect-error Vite
  publicBucket: import.meta.env.VITE_AWS_S3_PUBLIC_BUCKET.toString(),
}

export const getConfig = (): OpenNeuroConfig => config
