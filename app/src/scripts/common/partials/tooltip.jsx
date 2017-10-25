// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import newId from '../../utils/newid'

// component setup ---------------------------------------------------------------

export default class TooltipTop extends React.Component {
  // life cycle methods ------------------------------------------------------------

  componentWillMount() {
    this.id = newId('tooltip-id-')
  }

  render() {
    let tooltip = <Tooltip id={this.id}>{this.props.tooltip}</Tooltip>

    return (
      <OverlayTrigger
        placement="top"
        overlay={tooltip}
        delayShow={300}
        delayHide={150}>
        {this.props.children}
      </OverlayTrigger>
    )
  }
}

TooltipTop.propTypes = {
  tooltip: PropTypes.string,
  children: PropTypes.object,
}
