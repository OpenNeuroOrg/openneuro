// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Metric from '../common/partials/metric.jsx'

class Metrics extends React.PureComponent {
  // life cycle events --------------------------------------------------

  render() {
    const dataset = this.props.dataset
    const fromDashboard = this.props.fromDashboard
    const analytics = dataset.analytics
    const stars = dataset.stars ? '' + dataset.stars.length : '0'
    const downloads =
      analytics && analytics.downloads ? '' + analytics.downloads : '0'
    const views = analytics && analytics.views ? '' + analytics.views : '0'
    const followers = dataset.followers ? '' + dataset.followers.length : '0'
    const displayStars = fromDashboard ? (stars !== '0' ? true : false) : true
    const hasDownloads = downloads !== '0'
    const isSnapshot = dataset.hasOwnProperty('snapshot_version')
    const displayDownloads = fromDashboard
      ? hasDownloads
        ? true
        : false // don't display downloads on dash if the count is 0
      : isSnapshot
      ? true
      : false // don't display downloads on dataset page if the dataset is a draft
    const displayFollowers = fromDashboard
      ? followers !== '0'
        ? true
        : false
      : true // don't display followers on dash if the count is 0
    const displayViews = fromDashboard
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
