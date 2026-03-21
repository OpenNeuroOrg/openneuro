import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// Set up default global config for tests
// This allows config.ts to load without errors when imported by components
globalThis.OpenNeuroConfig = {
  CRN_SERVER_URL: "http://localhost:8111",
  GRAPHQL_URI: "http://localhost:8111/crn/graphql",
  GOOGLE_CLIENT_ID: "test-client-id",
  GLOBUS_CLIENT_ID: "test-globus-id",
  ORCID_CLIENT_ID: "test-orcid-id",
  ORCID_API_ENDPOINT: "https://orcid.org/orcid-pub",
  GITHUB_CLIENT_ID: "test-github-id",
  GOOGLE_TRACKING_IDS: "UA-test",
  ENVIRONMENT: "development",
  SENTRY_DSN: "",
  SUPPORT_URL:
    "https://openneuro.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=no",
  DATALAD_GITHUB_ORG: "openneuro",
  AWS_S3_PUBLIC_BUCKET: "test-bucket",
} as any
