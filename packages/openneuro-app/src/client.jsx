/**
 * Browser client entrypoint
 */
import "./scripts/utils/global-polyfill"
import "./scripts/sentry"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "./scripts/app"
import Index from "./scripts/index"
import { config } from "./scripts/config"
import * as gtag from "./scripts/utils/gtag"
import { relayStylePagination } from "@apollo/client/utilities"
// TODO - This should be a global SCSS?
import "./scripts/components/page/page.scss"

gtag.initialize(config.analytics.trackingIds)

const mainElement = document.getElementById("main")
const container = createRoot(mainElement)
const client = new ApolloClient({
  uri: `${config.url}/crn/graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          advancedSearch: relayStylePagination(),
        },
      },
    },
  }),
  connectToDevTools: config.sentry.environment !== "production",
})

container.render(
  <App>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </App>,
)
