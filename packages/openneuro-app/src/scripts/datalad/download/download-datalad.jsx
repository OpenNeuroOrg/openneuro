import React from 'react'
import PropTypes from 'prop-types'
import { getConfig } from '../../config'
import ShellExample from './shell-example.jsx'

const DownloadDataladExample = ({ datasetId, githubOrganization }) => (
  <ShellExample>
    datalad install https://github.com/
    {githubOrganization}/{datasetId}
    .git
  </ShellExample>
)

DownloadDataladExample.propTypes = {
  datasetId: PropTypes.string,
  githubOrganization: PropTypes.string,
}

const DownloadDataladInstructions = ({ datasetId, githubOrganization }) => (
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
    />
    <p>
      Check out{' '}
      <a href="http://handbook.datalad.org/r.html?openneuro">
        getting started with DataLad
      </a>{' '}
      for more on how to use this download method.
    </p>
  </div>
)

DownloadDataladInstructions.propTypes = {
  datasetId: PropTypes.string,
  githubOrganization: PropTypes.string,
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
