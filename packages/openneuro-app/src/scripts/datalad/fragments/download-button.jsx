import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import snapshotVersion from '../snapshotVersion'
import styled from '@emotion/styled'

const PaddedDiv = styled.div`
  padding: 1.5em 0 0.5em;
`
const ButtonText = styled.div`
  display: inline-block;
  height: 3rem;
  vertical-align: middle;
`
const LeftPadIconContainer = styled.div`
  display: inline-block;
  height: 3rem;
  padding-left: 0.5em;
  font-size: 1.5em;
`

/**
 * Immediate redirect to a dataset or snapshot route
 * @param {object} history react-router-dom history
 * @param {*} rootPath base path for relative redirects
 * @param {*} path target path for redirect
 */
const redirect = (history, rootPath, path) => {
  history.push(`${rootPath}/${path}`)
}

// prominent link to dataset download page
const DownloadButton = ({ dataset, location, history }) => {
  const snapshot = snapshotVersion(location)
  const rootPath = snapshot
    ? `/datasets/${dataset.id}/versions/${snapshot}`
    : `/datasets/${dataset.id}`

  return (
    <PaddedDiv>
      <button
        className="btn-blue"
        onClick={() => redirect(history, rootPath, 'download')}>
        <ButtonText>Download</ButtonText>
        <LeftPadIconContainer>
          <i className={'fa fa-arrow-circle-right align-middle'} />
        </LeftPadIconContainer>
      </button>
    </PaddedDiv>
  )
}

DownloadButton.propTypes = {
  dataset: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
}

export default withRouter(DownloadButton)
