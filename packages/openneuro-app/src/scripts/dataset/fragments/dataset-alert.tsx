import React from "react"
import { Link } from "react-router-dom"
import { DatasetAlert } from "../components/DatasetAlert"

export interface DatasetAlertDraftProps {
  isPrivate: boolean
  datasetId: string
  hasDraftChanges: boolean
  hasSnapshot: boolean
}

export const DatasetAlertDraft: React.FC<DatasetAlertDraftProps> = ({
  isPrivate,
  datasetId,
  hasDraftChanges,
  hasSnapshot,
}) => {
  if (isPrivate) {
    if (hasSnapshot) {
      return (
        <DatasetAlert
          alert="This dataset has not been published!"
          footer={hasDraftChanges &&
            "* There have been changes to the draft since your last version"}
          level="warning"
        >
          <>
            <Link
              className="dataset-tool"
              to={"/datasets/" + datasetId + "/publish"}
            >
              Publish this dataset
            </Link>
            &#32; to make all versions available publicly.
          </>
        </DatasetAlert>
      )
    } else {
      return (
        <DatasetAlert
          alert="This dataset has not been published!"
          level="warning"
        >
          Before it can be published, please&#32;
          <Link
            className="dataset-tool"
            to={"/datasets/" + datasetId + "/snapshot"}
          >
            create a version
          </Link>
        </DatasetAlert>
      )
    }
  } else {
    if (hasDraftChanges) {
      return (
        <DatasetAlert alert="This dataset has been published!" level="warning">
          There are currently unsaved changes to this draft. Changes made here
          become public when you&#32;
          <Link
            className="dataset-tool"
            to={"/datasets/" + datasetId + "/snapshot"}
          >
            create a new version.
          </Link>
        </DatasetAlert>
      )
    } else {
      return (
        <DatasetAlert alert="This dataset has been published!">
          You can make changes to this Draft page, then&#32;
          <Link
            className="dataset-tool"
            to={"/datasets/" + datasetId + "/snapshot"}
          >
            create a new version
          </Link>
          &#32;to make them public.
        </DatasetAlert>
      )
    }
  }
}
