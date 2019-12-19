import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import ToolTip from './copyable-tooltip.jsx'

const Container = styled.div({
  textAlign: 'right',
  padding: '5px 10px',
  color: '#565656',
  fontSize: '12px',
})

const AccessionNumber = ({ datasetId }) => (
  <div className="dataset-git-hash">
    <div className="col-xs-12">
      <Container className="fade-in">
        <ToolTip text={`Accession Number: ${datasetId}`} tip={datasetId} />
      </Container>
    </div>
  </div>
)

AccessionNumber.propTypes = {
  datasetId: PropTypes.string,
}

export default AccessionNumber
