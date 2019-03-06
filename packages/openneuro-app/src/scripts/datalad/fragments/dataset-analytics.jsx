import React from 'react'
import PropTypes from 'prop-types'
import Metric from '../../common/partials/metric.jsx'

const DatasetAnalytics = ({ downloads, views }) => (
  <>
    <Metric type="downloads" value={downloads} display />
    <Metric type="views" value={views} display />
  </>
)

DatasetAnalytics.propTypes = {
  downloads: PropTypes.number,
  views: PropTypes.number,
}

export default DatasetAnalytics
