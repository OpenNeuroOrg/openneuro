// dependencies -------------------------------------------------------

import React                     from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export default class WarnButton extends React.Component {

	constructor() {
		super();
		this.state = {
			showAction: false
		};
	}

// life cycle events --------------------------------------------------

	render () {
		let showAction = this.state.showAction;
		let message    = this.props.message;
		let cancel     = this.props.cancel;
		let confirm    = this.props.confirm;
		let tooltip    = <Tooltip>{this.props.tooltip}</Tooltip>;

		let viewAction = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={this.toggle.bind(this)}>{cancel}</button>
        		<button className={'btn btn-admin ' + (typeof this.props.tooltip == 'string' ? 'success' : 'delete')} onClick={this.toggle.bind(this, this.props.action)}>{confirm}</button>
        	</div>
        );

        let hideAction = (
        	<div className=" fadeIn" >
        		<button className="btn btn-admin warning" onClick={this.props.warn ? this.toggle.bind(this) : this.props.action}>
	        		<i className={'fa ' + this.props.icon}></i>  {message}
        		</button>
        	</div>
        );

        let button = showAction ? viewAction : hideAction;

        if (this.props.tooltip) {
        	return (
				<OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltip}>
					{button}
				</OverlayTrigger>
        	);
        }

		return button;
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

WarnButton.propTypes = {
	message: React.PropTypes.string,
	icon:    React.PropTypes.string,
	warn:    React.PropTypes.bool,
	tooltip: React.PropTypes.string
};

WarnButton.defaultProps = {
	message: '',
	cancel:  <i className="fa fa-times"></i>,
	confirm: <i className="fa fa-check"></i>,
	icon:    'fa-trash-o',
	warn:    true,
	tooltip: null
};