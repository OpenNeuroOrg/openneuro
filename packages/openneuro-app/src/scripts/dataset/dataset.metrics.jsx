// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Metric from '../common/partials/metric.jsx'

class Metrics extends React.Component {
  // life cycle events --------------------------------------------------

  render() {
    let dataset = this.props.dataset
    let fromDashboard = this.props.fromDashboard
    let analytics = dataset.analytics
    let stars = dataset.stars ? '' + dataset.stars.length : '0'
    let downloads =
      analytics && analytics.downloads ? '' + analytics.downloads : '0'
    let views = analytics && analytics.views ? '' + analytics.views : '0'
    let followers = dataset.followers ? '' + dataset.followers.length : '0'
    let displayStars = fromDashboard ? (stars !== '0' ? true : false) : true
    let hasDownloads = downloads !== '0'
    let isSnapshot = dataset.hasOwnProperty('snapshot_version')
    let displayDownloads = fromDashboard
      ? hasDownloads
        ? true
        : false // don't display downloads on dash if the count is 0
      : isSnapshot
        ? true
        : false // down't display downloads on dataset page if the dataset is a draft
    let displayFollowers = fromDashboard
      ? followers !== '0'
        ? true
        : false
      : true // don't display followers on dash if the count is 0
    let displayViews = fromDashboard
      ? analytics && views !== '0'
        ? true
        : false // don't display views on dash if the count is 0
      : isSnapshot
        ? true
        : false // don't display views on the dataset draft page
    return (
      <span className="metrics-wrap">
        <Metric type="stars" value={stars} display={displayStars} />
        <Metric type="followers" value={followers} display={displayFollowers} />
        <Metric type="views" value={views} display={displayViews} />
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
