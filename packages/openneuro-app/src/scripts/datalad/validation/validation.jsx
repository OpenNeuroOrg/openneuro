import React from 'react'
import PropTypes from 'prop-types'
import ValidationStatus from './validation-status.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'

const Validation = ({ issues, isMobile }) => {
  const mobileClass = isMobile
    ? 'mobile-validation-class'
    : 'fade-in col-xs-12 validation'
  return (
    <div className={mobileClass}>
      {!isMobile && <h3 className="metaheader">BIDS Validation</h3>}
      <ErrorBoundary subject={'error in dataset validation component'}>
        <ValidationStatus issues={issues} />
      </ErrorBoundary>
    </div>
  )
}

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
  isMobile: PropTypes.bool,
}

export default Validation
