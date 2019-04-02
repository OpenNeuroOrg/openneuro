// dependencies --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from './tooltip.jsx'

// component setup -----------------------------------------------------------

export default class Metric extends React.PureComponent {
  // lifecycle events ----------------------------------------------------------
  render() {
    if (!this.props.display) {
      return false
    }

    let spanClass, tip, iconClass
    const value = this.props.value ? this.props.value : 0
    const noun = this.props.snapshot ? 'snapshot' : 'dataset'

    switch (this.props.type) {
      case 'stars':
        spanClass = 'dataset-status ds-primary'
        iconClass = 'fa fa-star'
        tip = `This ${noun} has ${value} likes.`
        break
      case 'downloads':
        spanClass = 'dataset-status ds-primary'
        iconClass = 'fa fa-download'
        tip = `This ${noun} has ${value} downloads.`
        break
      case 'followers':
        spanClass = 'dataset-status ds-primary'
        iconClass = 'fa fa-users'
        tip = `This ${noun} has ${value} followers.`
        break
      case 'views':
        spanClass = 'dataset-status ds-primary'
        iconClass = 'fa fa-eye'
        tip = `This ${noun} has ${value} views.`
        break
    }

    let content = (
      <span className="icon-wrap">
        <i className={iconClass} />
        {value}
      </span>
    )

    if (tip) {
      content = <Tooltip tooltip={tip}>{content}</Tooltip>
    }

    return (
      <span className="metric">
        <span>
          <span className={spanClass}>{content}</span>
        </span>
      </span>
    )
  }
}

Metric.propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  display: PropTypes.bool,
  snapshot: PropTypes.bool,
}
