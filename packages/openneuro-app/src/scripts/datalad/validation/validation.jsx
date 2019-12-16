import React from 'react'
import PropTypes from 'prop-types'
import ValidationStatus from './validation-status.jsx'
import { ErrorBoundaryWithDataSet } from '../../errors/errorBoundary.jsx'

const Validation = ({ issues }) => {
  return (
    <div className="fade-in col-xs-12 validation">
      <h3 className="metaheader">BIDS Validation</h3>
      <ErrorBoundaryWithDataSet
        subject={'error in dataset validation component'}>
        <ValidationStatus issues={issues} />
      </ErrorBoundaryWithDataSet>
    </div>
  )
}

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
}

export default Validation
