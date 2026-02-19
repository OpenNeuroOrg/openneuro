import React from "react"
import Helmet from "react-helmet"
import { frontPage } from "../common/content/front-page-content"
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
          OpenNeuro is moving to ORCID for all accounts. Please link an ORCID to
          your account to continue and use ORCID for future logins. If you have
          used Google login before, any datasets, comments, and permissions you
          have will be merged into the combined OpenNeuro account linked to your
          ORCID iD.
        </p>
        <p>
        </p>
        <p>
          Please see{" "}
          <a href="https://docs.openneuro.org/orcid.html">our documentation</a>
          {" "}
          for additional details on how we use ORCID data and how to link your
          account.
        </p>
        <h3>Why are we making this change?</h3>
        <p>
          ORCID allows richer researcher metadata for contributions and
          optionally sharing contributions to datasets as works on your ORCID
          profile.
        </p>
        <h3>Will Google accounts continue to work?</h3>
        <p>
          To make new contributions you will need link an ORCID but any existing
          contributions will remain available.
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
