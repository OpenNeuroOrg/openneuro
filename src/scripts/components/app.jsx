// dependencies ----------------------------------------------------------

import React from 'react'
import Router from 'react-router'
let { DefaultRoute, RouteLink, Route, RouteHandler } = Router;


// partials
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
