/**
 * Interface describing the configuration object
 */
export interface OpenNeuroConfig {
  url: string
  api: string
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
  analytics?: { trackingId: string }
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
  // @ts-expect-error
  url: import.meta.env.VITE_CRN_SERVER_URL.toString(),
  // @ts-expect-error
  api: import.meta.env.VITE_API.toString(),
  auth: {
    // @ts-expect-error
    google: { clientID: import.meta.env.VITE_GOOGLE_CLIENT_ID.toString() },
    // @ts-expect-error
    globus: { clientID: import.meta.env.VITE_GLOBUS_CLIENT_ID.toString() },
    orcid: {
      // @ts-expect-error
      clientID: import.meta.env.VITE_ORCID_CLIENT_ID.toString(),
      // @ts-expect-error
      URI: import.meta.env.VITE_ORCID_URI.toString(),
      // @ts-expect-error
      redirectURI: import.meta.env.VITE_ORCID_REDIRECT_URI.toString(),
    },
  },
  // @ts-expect-error
  analytics: { trackingId: import.meta.env.VITE_GOOGLE_TRACKING_ID.toString() },
  // @ts-expect-error
  sentry: { environment: import.meta.env.VITE_ENVIRONMENT.toString() },
  // @ts-expect-error
  support: { url: import.meta.env.VITE_SUPPORT_URL.toString() },
  // @ts-expect-error
  github: import.meta.env.VITE_DATALAD_GITHUB_ORG.toString(),
  // @ts-expect-error
  publicBucket: import.meta.env.VITE_AWS_S3_PUBLIC_BUCKET.toString(),
}

export const getConfig = () => config
