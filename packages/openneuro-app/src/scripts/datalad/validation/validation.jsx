import React from 'react'
import PropTypes from 'prop-types'
import ValidationStatus from './validation-status.jsx'

const Validation = ({ datasetId, issues }) => (
  <div className="fade-in col-xs-12 validation">
    <h3 className="metaheader">BIDS Validation</h3>
    <ValidationStatus issues={issues} datasetId={datasetId} />
  </div>
)

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
}

export default Validation
