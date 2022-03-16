import React, { useState } from 'react'
import styled from '@emotion/styled'
import { ImportDatasetMutation } from '../dataset/mutations/import-dataset'
import { useLocation } from 'react-router-dom'
import LoggedIn from '../authentication/logged-in'
import LoggedOut from '../authentication/logged-out'
import { testAffirmed } from '../uploader/upload-disclaimer'
import { UploadDisclaimerInput } from '../uploader/upload-disclaimer-input'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const ImportDatasetPageStyle = styled.div`
  background: white;

  .container {
    max-width: 60em;
    min-height: calc(100vh - 125px);
  }
`

export const ImportDataset: React.VoidFunctionComponent = () => {
  const url = useQuery().get('url')
  const [affirmedDefaced, setAffirmedDefaced] = useState(false)
  const [affirmedConsent, setAffirmedConsent] = useState(false)
  return (
    <ImportDatasetPageStyle>
      <div className="container">
        <h2>Import a dataset from remote URL</h2>
        <p>
          Use this page to import a new OpenNeuro dataset from{' '}
          <a href="https://brainlife.io/ezbids/">ezBIDS</a>. After submitting an
          import, please allow some time for processing and you will receive an
          email notification when complete.
        </p>
        <LoggedIn>
          <UploadDisclaimerInput
            affirmedDefaced={affirmedDefaced}
            affirmedConsent={affirmedConsent}
            onChange={({ affirmedDefaced, affirmedConsent }): void => {
              setAffirmedDefaced(affirmedDefaced)
              setAffirmedConsent(affirmedConsent)
            }}
          />
          <ImportDatasetMutation
            url={url}
            disabled={testAffirmed(affirmedDefaced, affirmedConsent)}
            affirmedDefaced={affirmedDefaced}
            affirmedConsent={affirmedConsent}
          />
        </LoggedIn>
        <LoggedOut>
          <p>Please sign in to continue.</p>
        </LoggedOut>
      </div>
    </ImportDatasetPageStyle>
  )
}
