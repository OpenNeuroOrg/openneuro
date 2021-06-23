import React from 'react'
import PropTypes from 'prop-types'
import ValidationStatus from './validation-status.jsx'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'

const Validation = ({ issues }) => (
  <>
    <h3 className="metaheader">BIDS Validation</h3>

    <ErrorBoundary subject={'error in dataset validation component'}>
      <ValidationStatus issues={issues} />
    </ErrorBoundary>
  </>
)

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
}

export default Validation
