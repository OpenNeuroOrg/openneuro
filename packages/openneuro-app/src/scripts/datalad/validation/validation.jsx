import React from 'react'
import PropTypes from 'prop-types'
import ValidationStatus from './validation-status.jsx'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import { Media } from '../../styles/media'

const MobileClass = ({ children }) => (
  <>
    <Media at="small">
      <div className="mobile-validation-class">{children}</div>
    </Media>
    <Media greaterThanOrEqual="medium">
      <div className="fade-in col-xs-12 validation">{children}</div>
    </Media>
  </>
)

MobileClass.propTypes = {
  children: PropTypes.element.isRequired,
}

const Validation = ({ issues }) => (
  <MobileClass>
    <>
      <Media greaterThanOrEqual="medium">
        <h3 className="metaheader">BIDS Validation</h3>
      </Media>
      <ErrorBoundary subject={'error in dataset validation component'}>
        <ValidationStatus issues={issues} />
      </ErrorBoundary>
    </>
  </MobileClass>
)

Validation.propTypes = {
  datasetId: PropTypes.string,
  issues: PropTypes.array,
}

export default Validation
