import React from "react"
import type { ReactElement } from "react"
import { Attribution } from "../common/content/image-attribution"
import Helmet from "react-helmet"
import { frontPage } from "../common/content/front-page-content"
import styled from "@emotion/styled"

const ImageAttributionStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
  }
`

export function ImageAttribution(): ReactElement {
  return (
    <ImageAttributionStyle>
      <Helmet>
        <title>Image Attribution - {frontPage.pageTitle}</title>
        <meta
          name="description"
          content={`Image Attribution of the ${frontPage.pageTitle} data archive`}
        />
      </Helmet>
      <div className="container">
        <h2>OpenNeuro Image Attribution</h2>
        <Attribution />
      </div>
    </ImageAttributionStyle>
  )
}
