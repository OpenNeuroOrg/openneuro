import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import snapshotVersion from '../snapshotVersion'
import styled from '@emotion/styled'

const PaddedDiv = styled.div`
  padding: 0.5em 0 0.5em;
  display: flex;
  flex-wrap: wrap;
`
const LinkButton = styled.button`
  margin: 1rem 1rem 0 0;
  min-height: 3rem;
  border: none;
  border-radius: 0.5rem;
  background: #377881;
  background: -moz-linear-gradient(
    top,
    hsl(187, 40%, 36%) 0%,
    hsl(191, 56%, 26%) 100%
  );
  background: -webkit-linear-gradient(
    top,
    hsl(187, 40%, 36%) 0%,
    hsl(191, 56%, 26%) 100%
  );
  background: linear-gradient(
    to bottom,
    hsl(187, 40%, 36%) 0%,
    hsl(191, 56%, 26%) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#377881', endColorstr='#1d5967',GradientType=0 );
  display: flex;
  align-items: center;
  padding: 0.2em 1.33em;
  font-family: sans-serif;
  font-weight: 100;
  color: white;

  &:hover,
  &:active,
  &.hover,
  &.active,
  &:focus {
    background: #377881;
    background: -moz-linear-gradient(
      top,
      hsl(187, 40%, 24%) 0%,
      hsl(191, 56%, 18%) 100%
    );
    background: -webkit-linear-gradient(
      top,
      hsl(187, 40%, 24%) 0%,
      hsl(191, 56%, 18%) 100%
    );
    background: linear-gradient(
      to bottom,
      hsl(187, 40%, 24%) 0%,
      hsl(191, 56%, 18%) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#377881', endColorstr='#1d5967',GradientType=0 );
  }
`
const ButtonText = styled.div``
const LeftPadIconContainer = styled.div`
  padding-left: 0.67em;
  font-size: 1.25em;
`

/**
 * Immediate redirect to a dataset or snapshot route
 * @param {object} history react-router-dom history
 * @param {*} rootPath base path for relative redirects
 * @param {*} path target path for redirect
 */
const goToDownloadPage = (history, rootPath, path) => {
  history.push(`${rootPath}/${path}`)
}

/**
 * Immediate redirect to a dataset or snapshot route
 * @param {string} datasetId Accession number
 */
const goToBrainlife = datasetId => {
  window.open(`https://brainlife.io/openneuro/${datasetId}`, '_blank')
}

// prominent link to dataset download page
const ProminentLinks = ({ dataset, location, history }) => {
  const snapshot = snapshotVersion(location)
  const rootPath = snapshot
    ? `/datasets/${dataset.id}/versions/${snapshot}`
    : `/datasets/${dataset.id}`

  return (
    <PaddedDiv id="hi">
      <LinkButton
        className="download-link"
        onClick={() => goToDownloadPage(history, rootPath, 'download')}>
        <ButtonText>Download</ButtonText>
        <LeftPadIconContainer>
          <i className={'fa fa-arrow-circle-right align-middle'} />
        </LeftPadIconContainer>
      </LinkButton>
      {dataset.onBrainlife && (
        <LinkButton
          className="brainlife-link"
          onClick={() => goToBrainlife(dataset.id)}>
          <ButtonText>Analyze on brainlife.io</ButtonText>
        </LinkButton>
      )}
    </PaddedDiv>
  )
}

ProminentLinks.propTypes = {
  dataset: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
}

export default withRouter(ProminentLinks)
