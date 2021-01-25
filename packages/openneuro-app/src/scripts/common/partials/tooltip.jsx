// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import newId from '../../utils/newid'

// component setup ---------------------------------------------------------------

export default class TooltipTop extends React.PureComponent {
  // life cycle methods ------------------------------------------------------------

  componentWillMount() {
    this.id = newId('tooltip-id-')
  }

  render() {
    const tooltip = <Tooltip id={this.id}>{this.props.tooltip}</Tooltip>

    return this.props.tooltip ? (
      <OverlayTrigger
        placement="top"
        overlay={tooltip}
        delayShow={300}
        delayHide={150}>
        {this.props.children}
      </OverlayTrigger>
    ) : (
      this.props.children
    )
  }
}

TooltipTop.propTypes = {
  tooltip: PropTypes.string,
  children: PropTypes.object,
}
