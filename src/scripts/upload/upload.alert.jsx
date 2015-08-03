// dependencies ------------------------------------------------------------------

import React from 'react';
import {Alert} from 'react-bootstrap';


// component setup ---------------------------------------------------------------

let UploadAlertSuccess = React.createClass({

// life cycle methods ------------------------------------------------------------
	render: function () {
		return (
			<Alert className="fadeInDown clearfix" bsStyle='success'>
				<div className="alert-left"><strong>Success!</strong> Your Dataset has been added and saved to your Dashboard. </div> <button className="alert-right dismiss-button-x" onClick={this.props.onClose}> <i className="fa fa-times"></i> </button>
			</Alert>
	    );
	},

});



export default UploadAlertSuccess;
