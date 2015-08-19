// dependencies -------------------------------------------------------

import React from 'react';

export default class WarnButton extends React.Component {

	constructor() {
		super();
		this.state = {
			showDeleteBtn: false
		};
	}

// life cycle events --------------------------------------------------

	componentDidMount () {

	}

	render () {
		let showDeleteBtn = this.state.showDeleteBtn;
		let message       = this.props.message;
		let cancel        = this.props.cancel;
		let confirm       = this.props.confirm;
			
		let hideDeleteBtn = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={this.toggleDelete.bind(this)}>{cancel}</button>
        		<button className="btn btn-admin delete" onClick={this.props.action}>{confirm}</button>
        	</div>
        );

        let viewdeleteBtn = (
        	<div className=" fadeIn" >
        		 <button className="btn btn-admin warning" onClick={this.toggleDelete.bind(this)}>{message}<i className="fa fa-trash-o"></i> </button>
        	</div>
        );

		return (
			<div>{showDeleteBtn ? hideDeleteBtn : viewdeleteBtn}</div>
    	);
	}

// custom methods -----------------------------------------------------

	toggleDelete() {
		this.setState({showDeleteBtn: !this.state.showDeleteBtn});
	}

}

WarnButton.propTypes = {
	message: React.PropTypes.string,
	cancel:  React.PropTypes.string,
	confirm: React.PropTypes.string
};

WarnButton.defaultProps = {
	message: 'Delete',
	cancel:  'Cancel',
	confirm: 'Yes Delete!'
};