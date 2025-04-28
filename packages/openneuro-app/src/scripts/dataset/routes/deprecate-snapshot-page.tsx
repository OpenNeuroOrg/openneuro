import React, { useState } from "react"
import { DeprecateVersion } from "../mutations/deprecate-version"
import { Input } from "../../components/input/Input"
import LoggedIn from "../../authentication/logged-in.jsx"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow3 } from "./styles/header-row"

interface DeprecateSnapshotProps {
  datasetId: string
  snapshotTag: string
}

export const DeprecateSnapshotPage = ({
  datasetId,
  snapshotTag,
}: DeprecateSnapshotProps): React.ReactElement => {
  const [reason, setReason] = useState("")

  return (
    <DatasetPageBorder>
      <HeaderRow3>Deprecate Version</HeaderRow3>
      <p>
        {`Deprecate ${datasetId} version ${snapshotTag} to let other users know about an issue with this version. The reason provided will be displayed for users visiting the version.`}
      </p>
      <Input
        placeholder="Explanation for deprecation"
        type="text"
        name="front-page-search"
        labelStyle="default"
        setValue={setReason}
      />
      <br />
      <div className="dataset-form-controls">
        <LoggedIn>
          <DeprecateVersion
            datasetId={datasetId}
            tag={snapshotTag}
            reason={reason}
          />
        </LoggedIn>
      </div>
    </DatasetPageBorder>
  )
}
