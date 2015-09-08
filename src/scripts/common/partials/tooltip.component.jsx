// dependencies ------------------------------------------------------------------

import React       from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// component setup ---------------------------------------------------------------


export default class TooltipTop extends React.Component {


// life cycle methods ------------------------------------------------------------

	render() {
		let tooltip = <Tooltip>{this.props.tooltip}</Tooltip>;

		return (
			<OverlayTrigger placement='top' overlay={tooltip} delayShow={300} delayHide={150}>
				{this.props.children}
			</OverlayTrigger>
		);
	}

// custom methods ----------------------------------------------------------------

}



