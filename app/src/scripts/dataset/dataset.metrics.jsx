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
    let displayStars = fromDashboard ? (stars !== '0' ? true : false) : true

    return (
      <span className="metrics-wrap">
        <Metric type="stars" value={stars} display={displayStars} />
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
