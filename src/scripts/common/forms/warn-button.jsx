// dependencies -------------------------------------------------------

import React                     from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export default class WarnButton extends React.Component {

	constructor() {
		super();
		this.state = {
			showAction: false,
			link: null,
			loading: false
		};
	}

// life cycle events --------------------------------------------------

	render () {
		let showAction = this.state.showAction;
		let message    = this.props.message;
		let cancel     = this.props.cancel;
		let confirm    = this.props.confirm;
		let tooltip    = <Tooltip>{this.props.tooltip}</Tooltip>;

		let link;
		if (this.state.link) {
			link = (
				<a className="btn btn-admin success" onClick={this.toggle.bind(this)} href={this.state.link} download>
	        		{confirm}
	    		</a>
	    	);
		}

		let confirmBtn = <button className={'btn btn-admin ' + (typeof this.props.tooltip == 'string' ? 'success' : 'delete')} onClick={this.toggle.bind(this, this.props.action)}>{confirm}</button>;

		let viewAction = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={this.toggle.bind(this)}>{cancel}</button>
        		{link ? link : confirmBtn}
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
        let loading = <span><i className="fa fa-spin fa-circle-o-notch"></i></span>;

        if (this.props.tooltip) {
        	return (
				<OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltip}>
					{this.state.loading ? loading : button}
				</OverlayTrigger>
        	);
        }

		return button;
	}

// custom methods -----------------------------------------------------

	toggle(action) {
		if (this.state.showAction == false && this.props.prepDownload) {
			this.setState({loading: true});
			this.props.prepDownload((link) => {
				this.setState({showAction: true, link: link, loading: false});
			});
			return;
		}

		if (typeof action === 'function') {
			action(() => {
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
	tooltip: React.PropTypes.string,
	link:    React.PropTypes.string
};

WarnButton.defaultProps = {
	message: '',
	cancel:  <i className="fa fa-times"></i>,
	confirm: <i className="fa fa-check"></i>,
	icon:    'fa-trash-o',
	warn:    true,
	tooltip: null
};