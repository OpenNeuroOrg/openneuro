import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Row, Col } from 'react-bootstrap'

const UploadStepCol = ({ active, text }) => {
  const activeClasses = active
    ? ['upload-step', 'upload-step-active']
    : ['upload-step']
  return (
    <Col sm={6} md={3} className={activeClasses.join(' ')}>
      {text}
    </Col>
  )
}

UploadStepCol.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
}

const UploadStep = ({ location }) => (
  <Grid>
    <Row>
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
    </Row>
  </Grid>
)

UploadStep.propTypes = {
  location: PropTypes.object,
}

export default UploadStep
