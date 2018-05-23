import React from 'react'
import PropTypes from 'prop-types'

const Issues = ({ issues }) => JSON.stringify(issues)

Issues.propTypes = {
  issues: PropTypes.array,
}

export default Issues
