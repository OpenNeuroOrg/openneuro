// dependencies ------------------------------------------------------------------

import React from 'react';
import { Alert } from 'react-bootstrap';


// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

	mixins: [Reflux.connect(userStore), Navigation],

// life cycle methods ------------------------------------------------------------
	render: function () {
		return (
			<Alert className="fadeInDown" bsStyle='danger'>
				<strong>Holy danger!</strong> Best check yo self, you are not looking too good.
			</Alert>
	    );
	},

// custom methods ----------------------------------------------------------------

	_signOut: function () {
		Actions.signOut(this.transitionTo);
	}

});



export default BSNavbar;
