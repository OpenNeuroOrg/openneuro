import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import RowHeight from './row-height.jsx'

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
    Sentry.withScope(scope => {
      scope.setTag('datasetId', this.props.datasetId)
      this.setState({ eventId: Sentry.captureException(error) })
    })
  }

  render() {
    if (this.state.hasError) {
      const eventString = this.state.eventId
        ? ` with reference "${this.state.eventId}"`
        : ''
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
                <strong>If this persists, contact support {eventString}</strong>
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
