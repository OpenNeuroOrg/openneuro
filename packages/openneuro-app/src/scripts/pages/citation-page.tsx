import React from "react"
import Helmet from "react-helmet"
import { frontPage } from "../common/content/front-page-content"
import styled from "@emotion/styled"

const CitationPageStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
    min-height: calc(100vh - 125px);
  }
`

const CitationPage: React.VoidFunctionComponent = () => (
  <CitationPageStyle>
    <Helmet>
      <title>How to Cite - {frontPage.pageTitle}</title>
      <meta
        name="description"
        content="Citations for the OpenNeuro database and datasets"
      />
    </Helmet>
    <div className="container">
      <h2>How to Cite OpenNeuro</h2>
      <p>
        When referring to the database, the preferred style is
        &quot;OpenNeuro&quot; (not OpenNeuro.org). The first usage should be
        cited in a references section according to the style preferences of the
        venue.
      </p>
      <p>
        When referring a specific dataset, the dataset may be referred to as
        &quot;OpenNeuro Dataset ds00WXYZ&quot;, optionally followed by the
        dataset name in parentheses. The first usage of each dataset should be
        cited according to the style preferences of the venue.
      </p>
      <p>
        See &quot;How to Cite&quot; on each dataset page for examples generated
        for each dataset snapshot.
      </p>
      <div className="privacy-detail">
        <span>{frontPage.titlePanel.privacyDetail}</span>
      </div>
    </div>
  </CitationPageStyle>
)

export default CitationPage
