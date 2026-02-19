import React from "react"
import type { ReactElement } from "react"
import { Terms } from "../common/content/terms"
import Helmet from "react-helmet"
import { frontPage } from "../common/content/front-page-content"
import { DownloadAgreement } from "../common/content/download-agreement"
import styled from "@emotion/styled"

const TermsPageStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
  }
`

export function TermsPage(): ReactElement {
  return (
    <TermsPageStyle>
      <Helmet>
        <title>Terms and Conditions - {frontPage.pageTitle}</title>
        <meta
          name="description"
          content={`Terms and conditions of the ${frontPage.pageTitle} data archive`}
        />
      </Helmet>
      <div className="container">
        <h2>OpenNeuro Terms and Conditions</h2>
        <h3>
          By uploading to the {frontPage.pageTitle}{" "}
          data archive I agree to the following conditions:
        </h3>
        <Terms />
        <h3>Downloading Data:</h3>
        <p>{DownloadAgreement}</p>
      </div>
    </TermsPageStyle>
  )
}
