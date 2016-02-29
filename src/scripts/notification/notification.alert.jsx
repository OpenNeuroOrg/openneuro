// dependencies ------------------------------------------------------------------

import React             from 'react';
import Reflux            from 'reflux';
import {Alert}           from 'react-bootstrap';
import notificationStore from './notification.store';
import actions           from './notification.actions';


// component setup ---------------------------------------------------------------

let alert = React.createClass({

	mixins: [Reflux.connect(notificationStore)],

// life cycle methods ------------------------------------------------------------

	render() {
		let type = this.state.alertType;
		let bsStyle;
		if (type === 'Warning') {bsStyle = 'warning';}
		if (type === 'Error')   {bsStyle = 'danger';}
		if (type === 'Success') {bsStyle = 'success';}

		let alert = (
			<Alert className="slideInLeft clearfix" bsStyle={bsStyle}>
				<div className="alert-left">
					<strong>{type}! </strong>
					{this.state.alertMessage}
				</div>
				<button className="alert-right dismiss-button-x" onClick={actions.closeAlert}>
					<i className="fa fa-times"></i>
				</button>
			</Alert>
		)

		return this.state.showAlert ? alert : false;
	}

});

export default alert;