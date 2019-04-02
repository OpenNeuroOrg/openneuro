import React from 'react'
import PropTypes from 'prop-types'
import Metric from '../../common/partials/metric.jsx'
import styled from '@emotion/styled'

const MetricPadding = styled.span`
  padding: 4px;
`

const DatasetAnalytics = ({ downloads, views, snapshot }) => (
  <>
    <MetricPadding>
      <Metric type="downloads" value={downloads} display snapshot={snapshot} />
    </MetricPadding>
    <MetricPadding>
      <Metric type="views" value={views} display snapshot={snapshot} />
    </MetricPadding>
  </>
)

DatasetAnalytics.propTypes = {
  downloads: PropTypes.number,
  views: PropTypes.number,
  snapshot: PropTypes.bool,
}

export default DatasetAnalytics
