import React from 'react'
import PropTypes from 'prop-types'

const UploadStepCol = ({ active, text }) => {
  const activeClasses = active
    ? ['upload-step', 'upload-step-active']
    : ['upload-step']
  return <div className={'col col-3 ' + activeClasses.join(' ')}>{text}</div>
}

UploadStepCol.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
}

const UploadStep = ({ location }) => (
  <div className="grid">
    <UploadStepCol
      text="Step 1: Select Files"
      active={location.pathname === '/upload'}
    />
    <UploadStepCol
      text="Step 2: Validation"
      active={location.pathname === '/upload/issues'}
    />
    <UploadStepCol
      text="Step 3: Metadata"
      active={location.pathname === '/upload/metadata'}
    />
    <UploadStepCol
      text="Step 4: Accept Terms"
      active={location.pathname === '/upload/disclaimer'}
    />
  </div>
)

UploadStep.propTypes = {
  location: PropTypes.object,
}

export default UploadStep
