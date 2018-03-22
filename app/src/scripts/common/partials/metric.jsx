// dependencies --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from './tooltip.jsx'

// component setup -----------------------------------------------------------

export default class Metric extends React.Component {
  // lifecycle events ----------------------------------------------------------
  render() {
    if (!this.props.display) {
      return false
    }

    let spanClass, tip, iconClass
    let value = this.props.value ? this.props.value : null

    switch (this.props.type) {
      case 'stars':
        spanClass = 'dataset-status ds-primary'
        iconClass = 'fa fa-star'
        tip = 'This dataset has ' + value + ' likes.'
        break
      case 'downloads':
        spanClass = 'dataset-status ds-primary'
        iconClass = 'fa fa-download'
        tip = 'This dataset has ' + value + ' downloads.'
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
  value: PropTypes.string,
  display: PropTypes.bool,
}
