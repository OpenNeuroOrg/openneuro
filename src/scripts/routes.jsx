// dependencies ----------------------------------------------------------

import React from 'react';
import {DefaultRoute, Route} from 'react-router';
import requireAuth from './utils/requireAuth';

// views
import Index    from './common/index.jsx';
import Signin from './user/signin.component.jsx';
import Upload from './upload/upload.component.jsx';
import Home   from './common/views/home.component.jsx';

// routes ----------------------------------------------------------------

Upload = requireAuth(Upload);

let routes = (
	<Route name="app" path="/" handler={Index}>
		<Route name="signIn" handler={Signin}/>
		<Route name="upload" handler={Upload}/>
		<Route name="home" handler={Home}/>
		<DefaultRoute handler={Signin}/>
	</Route>
);

export default routes;

