// dependencies -------------------------------------------------------

import React from 'react';
import {OverlayTrigger, Tooltip}      		from 'react-bootstrap';


export default class WarnButtonWithTip extends React.Component {

	constructor() {
		super();
		this.state = {
			showAction: false
		};
	}

// life cycle events --------------------------------------------------

	componentDidMount () {

	}

	render () {
		let showAction 		= this.state.showAction;
		let message       	= this.props.message;
		let cancel        	= this.props.cancel;
		let confirm       	= this.props.confirm;
		let tooltipstring 	= this.props.tooltip;
		let tooltip 		= <Tooltip>{tooltipstring}</Tooltip>;
		let iconCancel 		= <i className="fa fa-times"></i>;
		let iconConfirm 	= <i className="fa fa-check"></i>

		let viewAction = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={this.toggle.bind(this)}>{iconCancel}</button>
        		<button className="btn btn-admin success" onClick={this.toggle.bind(this, this.props.action)}>{iconConfirm}</button>
        	</div>
        );

        let hideAction = (
        	<div className=" fadeIn" >
        		<OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltip}>
        		 	<button className="btn btn-admin warning" onClick={this.toggle.bind(this)}><i className={'fa ' + this.props.icon}></i>  {message}</button>
        		</OverlayTrigger>
        	</div>
        );

		return (
			<div>{showAction ? viewAction : hideAction}</div>
    	);
	}

// custom methods -----------------------------------------------------

	toggle(action) {
		if (typeof action === 'function') {
			this.props.action(() => {
				this.setState({showAction: !this.state.showAction});
			});
		} else {
			this.setState({showAction: !this.state.showAction});
		}
	}

}

WarnButtonWithTip.propTypes = {
	message: 		React.PropTypes.string,
	cancel:  		React.PropTypes.string,
	confirm: 		React.PropTypes.string,
	tooltipstring: 	React.PropTypes.string,
	icon:    		React.PropTypes.string
};

WarnButtonWithTip.defaultProps = {
	message: 		'Delete',
	cancel:  		'Cancel',
	confirm: 		'Yes Delete!',
	tooltipstring: 	'tooltip',
	icon:    		'fa-trash-o'
};