import React from 'react'
import PropTypes from 'prop-types'
import ValidationStatus from './validation-status.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
//TODO error boundary in refactor
const Validation = ({ issues }) => (
  <>
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
