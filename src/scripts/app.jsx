// dependencies ----------------------------------------------------------

import React from 'react'
import Router from 'react-router'
let { DefaultRoute, RouteLink, Route, RouteHandler } = Router;

// components ------------------------------------------------------------

// views
import Signin from './components/views/signin.component.jsx';
import Upload from './components/views/upload.component.jsx';
// partials
import Navbar from './components/partials/navbar.component.jsx';

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

// routes ----------------------------------------------------------------


//TODO - set route to signin when user is not logged in. disable all other routes

var routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="signIn" handler={Signin}/>
		<Route name="upload" handler={Upload}/>
		<DefaultRoute handler={Signin}/>
	</Route>
);

// render handler --------------------------------------------------------

Router.run(routes, function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});

