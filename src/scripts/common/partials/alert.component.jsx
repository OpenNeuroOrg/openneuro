// dependencies ------------------------------------------------------------------

import React from 'react';
import { Alert } from 'react-bootstrap';


// component setup ---------------------------------------------------------------

let UploadAlertSuccess = React.createClass({

// life cycle methods ------------------------------------------------------------
	render: function () {
		return (
			<Alert className="fadeInDown" bsStyle='success'>
				<strong>Success!</strong> Your Dataset has been added and saved to your Dashboard.
			</Alert>
	    );
	},

});



export default UploadAlertSuccess;
