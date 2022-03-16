import React from 'react'
import PropTypes from 'prop-types'
import { getConfig, config } from '../../config'
import ShellExample from './shell-example.jsx'
import {
  getUnexpiredProfile,
  hasEditPermissions,
} from '../../authentication/profile'
import { useCookies } from 'react-cookie'

const DownloadDataladExample = ({
  datasetId,
  githubOrganization,
  workerId,
  datasetPermissions,
}) => {
  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)
  const isAdmin = profile?.admin
  const hasEdit =
    hasEditPermissions(datasetPermissions, profile?.sub) || isAdmin
  return (
    <>
      <ShellExample>
        datalad install https://github.com/
        {githubOrganization}/{datasetId}
        .git
      </ShellExample>
      {hasEdit && (
        <ShellExample>
          datalad install {config.url}/git/{workerId}/{datasetId}
        </ShellExample>
      )}
    </>
  )
}

DownloadDataladExample.propTypes = {
  datasetId: PropTypes.string,
  githubOrganization: PropTypes.string,
  workerId: PropTypes.string,
  datasetPermissions: PropTypes.object,
}

const DownloadDataladInstructions = ({
  datasetId,
  githubOrganization,
  workerId,
  datasetPermissions,
}) => (
  <div>
    <h4>Download with DataLad</h4>
    <p>
      Public datasets can be downloaded with{' '}
      <a href="https://www.datalad.org">DataLad</a> or{' '}
      <a href="https://git-annex.branchable.com/">Git Annex</a> from{' '}
      <a href={`https://github.com/${githubOrganization}/${datasetId}`}>
        GitHub.
      </a>
    </p>
    <DownloadDataladExample
      datasetId={datasetId}
      githubOrganization={githubOrganization}
      workerId={workerId}
      datasetPermissions={datasetPermissions}
    />
    <p>
      Check out{' '}
      <a href="https://handbook.datalad.org/en/latest/usecases/openneuro.html">
        getting started with DataLad
      </a>{' '}
      for more on how to use this download method.
    </p>
  </div>
)

DownloadDataladInstructions.propTypes = {
  datasetId: PropTypes.string,
  githubOrganization: PropTypes.string,
  workerId: PropTypes.string,
  datasetPermissions: PropTypes.object,
}

const DownloadDatalad = props =>
  // TODO - don't depend on async config
  getConfig().hasOwnProperty('github') ? (
    <DownloadDataladInstructions
      {...props}
      githubOrganization={getConfig().github}
    />
  ) : null

export default DownloadDatalad
