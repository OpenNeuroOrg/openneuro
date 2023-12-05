import React from "react"
import { DatasetAlert } from "../components/DatasetAlert"
import { UndoDeprecateVersion } from "../mutations/undo-deprecate-version"

export interface DatasetAlertVersionProps {
  datasetId: string
  tag: string
  reason: string
  hasEdit: boolean
}

export const DatasetAlertVersion: React.FC<DatasetAlertVersionProps> = ({
  datasetId,
  tag,
  reason,
  hasEdit,
}) => (
  <DatasetAlert
    alert="This version has been deprecated!"
    level="error"
    footer={reason}
  >
    {hasEdit && <UndoDeprecateVersion datasetId={datasetId} tag={tag} />}
  </DatasetAlert>
)
