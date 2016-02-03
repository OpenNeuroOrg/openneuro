// dependencies ------------------------------------------------------------------

import React from 'react';
import {Alert} from 'react-bootstrap';


// component setup ---------------------------------------------------------------

export default class UploadAlert extends React.Component {

// life cycle methods ------------------------------------------------------------

	render() {
		let type = this.props.type;
		let bsStyle;
		if (type === 'Warning') {bsStyle = 'warning';}
		if (type === 'Error')   {bsStyle = 'danger';}
		if (type === 'Success') {bsStyle = 'success';}

		return (
			<Alert className="fadeInUp clearfix" bsStyle={bsStyle}>
				<div className="alert-left">
					<strong>{type}! </strong>
					{this.props.message}
				</div>
				<button className="alert-right dismiss-button-x" onClick={this.props.onClose}>
					<i className="fa fa-times"></i>
				</button>
			</Alert>
	    );
	}

}