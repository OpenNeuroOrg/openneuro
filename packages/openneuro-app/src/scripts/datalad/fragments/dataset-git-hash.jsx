import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import ToolTip from './copyable-tooltip.jsx'

const Container = styled.div({
  textAlign: 'right',
  padding: '0 10px',
  color: '#565656',
  fontSize: '12px',
})

const DatasetGitHash = ({ gitHash }) => (
  <div className="dataset-git-hash">
    <div className="col-xs-12">
      <Container className="fade-in">
        <ToolTip text={`Git Hash: ${gitHash.slice(0, 7)}`} tip={gitHash} />
      </Container>
    </div>
  </div>
)

DatasetGitHash.propTypes = {
  gitHash: PropTypes.string,
}

export default DatasetGitHash
