import React from "react"
import styled from "@emotion/styled"
import { Link } from "react-router-dom"

import nirs from "../../../../../openneuro-components/src/assets/nirs.jpg"
import nih from "../../../../../openneuro-components/src/assets/nih_cube.jpg"

/** Image attribution content. */
export function Attribution(): React.ReactElement {
  const AtributionBlock = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    img {
      width: 30%;
      max-width: 200px;
      margin-right: 20px;
      height: auto;
    }
    label {
      font-weight: bold;
    }
      p:first-of-type{ margin-top:0}
  `

  return (
    <>
      <AtributionBlock>
        <img src={nirs} alt="" />
        <p>
          <div>
            <label>Used with permission:</label>{" "}
            <a href="https://mne.tools/mne-nirs/stable/index.html">
              MNE-NIRS
            </a>
          </div>
          <div>
            <label>Locations used: {" "}</label>
            <Link to="/">
              OpenNeuro
            </Link>
            {", "}
            <Link to="/search/modality/nirs?query=%7B%22modality_selected%22%3A%22NIRS%22%7D">
              NIRS Modality Search
            </Link>
          </div>
        </p>
      </AtributionBlock>
      <AtributionBlock>
        <img src={nih} alt="" />
        <p>
          <div>
            <label>Used with permission:</label>{" "}
            <a href="https://braininitiative.nih.gov/">
              NIH BRAIN Initiative<sup>&reg;</sup>
            </a>
          </div>
          <div>
            <label>Locations used: {" "}</label>
            <Link to="/">
              OpenNeuro
            </Link>
            {", "}
            <Link to="/search/nih?query=%7B%22brain_initiative%22%3A%22true%22%7D">
              NIH BRAIN Initiative Portal
            </Link>
          </div>
        </p>
      </AtributionBlock>
    </>
  )
}
