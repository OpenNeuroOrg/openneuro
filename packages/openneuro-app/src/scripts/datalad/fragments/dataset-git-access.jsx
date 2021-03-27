import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { config } from '../../config'
import Tooltip from '../../common/partials/tooltip.jsx'

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

const GitAccessWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '0',
  marginBottom: '10px',
})

const GitAccessUrl = styled.span({
  flexGrow: 1,
})

const DocumentationLink = styled.a({
  textAlign: 'right',
  padding: '5px',
  textTransform: 'capitalize',
})

const DatasetGitAccess = ({ datasetId, worker }) => {
  const workerId = worker.split('-').pop()
  const url = `${config.url}/git/${workerId}/${datasetId}`
  return (
    <div className="col-xs-12">
      <h3 className="metaheader">DataLad/Git URL</h3>
      <GitAccessWrap className="status panel panel-default">
        <Tooltip tooltip="Copy To Clipboard">
          <button
            className="warning btn-warn-component"
            onClick={() => copyToClipboard(url)}>
            <i className="fa fa-clipboard" aria-hidden="true"></i>
          </button>
        </Tooltip>{' '}
        <GitAccessUrl>{url}</GitAccessUrl>
        <DocumentationLink href="https://docs.openneuro.org/git">
          View Documentation
        </DocumentationLink>
      </GitAccessWrap>
    </div>
  )
}

DatasetGitAccess.propTypes = {
  datasetId: PropTypes.string,
  worker: PropTypes.string,
}

export default DatasetGitAccess
