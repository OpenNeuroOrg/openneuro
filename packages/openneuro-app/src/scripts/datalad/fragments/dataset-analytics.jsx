import React from 'react'
import PropTypes from 'prop-types'
import Metric from '../../common/partials/metric.jsx'

const DatasetAnalytics = ({ downloads, views, snapshot }) => (
  <>
    <Metric type="downloads" value={downloads} display snapshot={snapshot} />
    <Metric type="views" value={views} display snapshot={snapshot} />
  </>
)

DatasetAnalytics.propTypes = {
  downloads: PropTypes.number,
  views: PropTypes.number,
  snapshot: PropTypes.bool,
}

export default DatasetAnalytics
