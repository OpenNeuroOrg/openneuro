import React, { ReactElement } from "react"
import { Terms } from "../common/content/terms"
import Helmet from "react-helmet"
import { frontPage } from "./front-page/front-page-content"
import styled from "@emotion/styled"

const TermsPageStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
    min-height: calc(100vh - 125px);
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
        <h2>OpenNeuro Upload Terms and Conditions</h2>
        <p>
          By uploading to the {frontPage.pageTitle}{" "}
          data archive I agree to the following conditions:
        </p>
        <Terms />
      </div>
    </TermsPageStyle>
  )
}
