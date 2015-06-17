// dependencies ----------------------------------------------------------

import React from 'react';
import {RouteHandler} from 'react-router';
import Navbar from './partials/navbar.component.jsx';

// parent view -----------------------------------------------------------

var App = React.createClass({
	render: function () {
		return (
			<div className="page">
				<Navbar />
				<RouteHandler />
			</div>
		)				
	}
});

export default App;
