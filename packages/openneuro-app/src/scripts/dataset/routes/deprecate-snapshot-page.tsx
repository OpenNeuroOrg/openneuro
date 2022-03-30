import React, { useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { DeprecateVersion } from '../mutations/deprecate-version'
import { Input } from '@openneuro/components/input'
import LoggedIn from '../../authentication/logged-in.jsx'
import { DatasetPageBorder } from './styles/dataset-page-border'
import { HeaderRow3 } from './styles/header-row'

interface DeprecateSnapshotRouteParams {
  datasetId: string
  snapshotTag: string
}

export const DeprecateSnapshotPage = (): React.ReactElement => {
  const {
    params: { datasetId, snapshotTag },
  } = useRouteMatch<DeprecateSnapshotRouteParams>()
  const [reason, setReason] = useState('')

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
      <hr />
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
