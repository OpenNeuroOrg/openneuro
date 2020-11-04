// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import newId from '../../utils/newid'

export default class TooltipTop extends React.PureComponent {
  render() {
    const tooltip = (
      <Tooltip id={newId('tooltip-id-')}>{this.props.tooltip}</Tooltip>
    )

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
