import React from 'react'
import PropTypes from 'prop-types'
import RowHeight from './row-height.jsx'
import { apm } from '../../../apm'

/**
 * Don't prevent rendering all of the other results if one has failed to load
 */
class DatasetRowErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, eventId: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    apm.captureError(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel panel-default">
          <RowHeight className="panel-heading">
            <div className="header clearfix">
              <h4 className="dataset-title">
                An error occurred while displaying this result
              </h4>
            </div>
            <div className="clearfix minimal-summary">
              <div className="summary-data">
                <strong>If this persists, contact support</strong>
              </div>
            </div>
          </RowHeight>
        </div>
      )
    }

    return this.props.children
  }
}

DatasetRowErrorBoundary.propTypes = {
  datasetId: PropTypes.string,
  children: PropTypes.node,
}

export default DatasetRowErrorBoundary
