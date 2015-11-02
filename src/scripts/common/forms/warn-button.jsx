// dependencies -------------------------------------------------------

import React from 'react';

export default class WarnButton extends React.Component {

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
		let showAction = this.state.showAction;
		let message       = this.props.message;
		let cancel        = this.props.cancel;
		let confirm       = this.props.confirm;

		let viewAction = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={this.toggle.bind(this)}>{cancel}</button>
        		<button className="btn btn-admin delete" onClick={this.toggle.bind(this, this.props.action)}>{confirm}</button>
        	</div>
        );

        let hideAction = (
        	<div className=" fadeIn" >
        		 <button className="btn btn-admin warning" onClick={this.toggle.bind(this)}><i className={'fa ' + this.props.icon}></i>  {message}</button>
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

WarnButton.propTypes = {
	message: React.PropTypes.string,
	cancel:  React.PropTypes.string,
	confirm: React.PropTypes.string,
	icon:    React.PropTypes.string
};

WarnButton.defaultProps = {
	message: 'Delete',
	cancel:  'Cancel',
	confirm: 'Yes Delete!',
	icon:    'fa-trash-o'
};