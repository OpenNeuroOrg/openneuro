// dependencies ----------------------------------------------------------

import React from 'react'
import Router from 'react-router'

let DefaultRoute = Router.DefaultRoute;
let RouteLink    = Router.Link;
let Route        = Router.Route;
let RouteHandler = Router.RouteHandler;

// components ------------------------------------------------------------

// views
import Signin from './components/views/signin.component.jsx';
import Home from './components/views/home.component.jsx';
//gregs test
import Upload from './components/views/upload.component.jsx';
// partials
import Navbar from './components/partials/navbar.component.jsx';

// parent view -----------------------------------------------------------

var App = React.createClass({
	render: function () {
		return (
			<div className="page">
				<Navbar link={RouteLink} />
				<div className="container">
					<RouteHandler/>
				</div>
			</div>
		)				
	}
});

// routes ----------------------------------------------------------------

var routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="home" handler={Home}/>
		<Route name="signIn" handler={Signin}/>
		<Route name="upload" handler={Upload}/>
		<DefaultRoute handler={Home}/>
	</Route>
);

// render handler --------------------------------------------------------

Router.run(routes, function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});

