// dependencies -------------------------------------------------------

import React from 'react';

export default class AddUser extends React.Component {

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
		let self = this;
		let showDeleteBtn = this.state.showDeleteBtn;
			
		let hideDeleteBtn = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={this.toggleDelete.bind(this)}>Cancel</button>
        		<button className="btn btn-admin delete" onClick={this.props.action}>Yes Delete!</button>
        	</div>
        );

        let viewdeleteBtn = (
        	<div className=" fadeIn" >
        		 <button className="btn btn-admin warning" onClick={this.toggleDelete.bind(this)}>Delete this User <i className="fa fa-trash-o"></i> </button>
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