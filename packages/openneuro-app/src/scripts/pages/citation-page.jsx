import React from 'react'
import { frontPage } from 'openneuro-content'
import styled from '@emotion/styled'
import Footer from '../common/partials/footer.jsx'

const CitationPageStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
    min-height: calc(100vh - 125px);
  }
`

export default function CitationPage() {
  return (
    <CitationPageStyle>
      <div className="container">
        <h2>How to Cite OpenNeuro</h2>
        <p>
          When referring to the database, the preferred style is "OpenNeuro"
          (not OpenNeuro.org). The first usage should be cited in a references
          section according to the style preferences of the venue.
        </p>
        <p>
          When referring a specific dataset, the dataset may be referred to as
          "OpenNeuro Dataset ds00WXYZ", optionally followed by the dataset name
          in parentheses. The first usage of each dataset should be cited
          according to the style preferences of the venue.
        </p>
        <p>
          See "How to Cite" on each dataset page for examples generated for each
          dataset snapshot.
        </p>
        <div className="privacy-detail">
          <span>{frontPage.titlePanel.privacyDetail}</span>
        </div>
      </div>
      <Footer />
    </CitationPageStyle>
  )
}
