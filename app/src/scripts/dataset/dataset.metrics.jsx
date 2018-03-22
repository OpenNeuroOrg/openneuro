// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Metric from '../common/partials/metric.jsx'

class Metrics extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    let dataset = this.props.dataset
    let fromDashboard = this.props.fromDashboard
    let stars = dataset.stars ? '' + dataset.stars.length : '0'
    let downloads = dataset.downloads ? '' + dataset.downloads : '0'
    let displayStars = fromDashboard ? (stars !== '0' ? true : false) : true
    let hasDownloads = downloads !== '0'
    let isSnapshot = dataset.hasOwnProperty('original')
    let displayDownloads = fromDashboard
      ? hasDownloads ? true : false // don't display downloads on dash if the count is 0
      : isSnapshot ? true : false // down't display downloads on dataset page if the dataset is a draft

    return (
      <span className="metrics-wrap">
        <Metric type="stars" value={stars} display={displayStars} />
        <Metric type="downloads" value={downloads} display={displayDownloads} />
      </span>
    )
  }
}

Metrics.defaultProps = {
  fromDashboard: false,
}

Metrics.propTypes = {
  dataset: PropTypes.object,
  fromDashboard: PropTypes.bool,
}

export default Metrics
