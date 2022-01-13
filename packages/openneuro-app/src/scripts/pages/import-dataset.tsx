import React from 'react'
import styled from '@emotion/styled'
import { ImportDatasetMutation } from '../refactor_2021/dataset/mutations/import-dataset'
import { useLocation } from 'react-router-dom'
import LoggedIn from '../refactor_2021/authentication/logged-in'
import LoggedOut from '../refactor_2021/authentication/logged-out'

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
  return (
    <ImportDatasetPageStyle>
      <div className="container">
        <h2>Import a dataset from remote URL</h2>
        <p>
          Use this page to import a new OpenNeuro dataset from{' '}
          <a href="https://brainlife.io/ezbids/">ezBIDS</a>. After submitting an
          import, please allow several hours for processing and you will receive
          an email notification when complete.
        </p>
        <LoggedIn>
          <ImportDatasetMutation url={url} />
        </LoggedIn>
        <LoggedOut>
          <p>Please sign in to continue.</p>
        </LoggedOut>
      </div>
    </ImportDatasetPageStyle>
  )
}
