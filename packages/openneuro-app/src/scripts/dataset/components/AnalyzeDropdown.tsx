import React from "react"
import { Dropdown } from "@openneuro/components/dropdown"
import { Button } from "@openneuro/components/button"
import styled from "@emotion/styled"
import BrainlifeIcon from "../../../assets/external/brainlife.png"
import NemarIcon from "../../../assets/external/nemar.png"
import CbrainIcon from "../../../assets/external/cbrain.png"

export interface CloneDropdownProps {
  datasetId: string
  snapshotVersion: string
}

const AnalyzeDiv = styled.div`
  padding-right: 1em;
`

export const AnalyzeDropdown: React.FC<CloneDropdownProps> = (
  { datasetId, snapshotVersion },
) => {
  const brainlifeUrl =
    `https://brainlife.io/openneuro/${datasetId}/${snapshotVersion}`
  const nemarUrl =
    `https://nemar.org/dataexplorer/detail?dataset_id=${datasetId}`
  const cbrainUrl =
    `https://portal.cbrain.mcgill.ca/openneuro/${datasetId}/versions/${snapshotVersion}`
  return (
    <AnalyzeDiv className="clone-dropdown">
      <Dropdown
        label={
          <Button
            className="clone-link"
            primary={true}
            size="small"
            label="Analyze"
          >
            <i className="fas fa-caret-up"></i>
            <i className="fas fa-caret-down"></i>
          </Button>
        }
      >
        <div className="dataset-git-access">
          <span>
            <h4>Analyze this dataset</h4>
          </span>
          <p>
            Work with OpenNeuro datasets using any of these third-party tools.
          </p>
          <hr />
          <img
            src={BrainlifeIcon}
            height="16"
            width="16"
          />{" "}
          <a
            href={brainlifeUrl}
            target="_blank"
          >
            View on Brainlife.io
          </a>
          <p>
            Brainlife.io is a free cloud platform for secure neuroscience data
            analysis.
          </p>
          <hr />
          <img
            src={NemarIcon}
            height="16"
            width="16"
          />{" "}
          <a
            href={nemarUrl}
            target="_blank"
          >
            View on NEMAR
          </a>
          <p>
            View and analyze this dataset on the NEMAR OpenNeuro portal for MEG,
            iEEG, and EEG data.
          </p>
          <hr />
          <img
            src={CbrainIcon}
            height="16"
            width="16"
          />{" "}
          <a href={cbrainUrl} target="_blank">
            View on CBRAIN
          </a>
          <p>
            CBRAIN is a web-based distributed computing platform for
            collaborative neuroimaging research.
          </p>
        </div>
      </Dropdown>
    </AnalyzeDiv>
  )
}
