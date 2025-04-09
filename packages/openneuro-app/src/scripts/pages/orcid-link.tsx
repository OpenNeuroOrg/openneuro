import React from "react"
import Helmet from "react-helmet"
import { frontPage } from "./front-page/front-page-content"
import loginUrls from "../authentication/loginUrls"
import { Button } from "../components/button/Button"
import orcidIcon from "../../assets/orcid_24x24.png"
import styled from "@emotion/styled"

const OrcidLinkPageStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
    min-height: calc(100vh - 152px);
  }
`

export function OrcidLinkPage() {
  return (
    <OrcidLinkPageStyle>
      <Helmet>
        <title>
          Link ORCID to your existing account - {frontPage.pageTitle}
        </title>
        <meta
          name="description"
          content="How to link your ORCID account to your Google based OpenNeuro account"
        />
      </Helmet>
      <div className="container">
        <h2>ORCID account migration</h2>
        <p>
          OpenNeuro is moving to ORCID for all logins. Please link an ORCID to
          your account to continue and use ORCID for future logins.
        </p>
        <a href={loginUrls.orcid + `?migrate`}>
          <Button
            className="login-button"
            label="Link ORCID"
            imgSrc={orcidIcon}
          />
        </a>
      </div>
    </OrcidLinkPageStyle>
  )
}
