// dependencies ----------------------------------------------------------

import React from 'react'
import Router from 'react-router'
let { DefaultRoute, RouteLink, Route } = Router;
import requireAuth from './utils/requireAuth';
// views
import Signin from './components/views/signin.component.jsx';
import Upload from './components/views/upload.component.jsx';
import Home from './components/views/home.component.jsx';

// parent view -----------------------------------------------------------

import App from './components/app.jsx';

// routes ----------------------------------------------------------------

Upload = requireAuth(Upload);

var routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="signIn" handler={Signin}/>
		<Route name="upload" handler={Upload}/>
		<Route name="home" handler={Home}/>
		<DefaultRoute handler={Signin}/>
	</Route>
);

// render handler --------------------------------------------------------

Router.run(routes, function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});

