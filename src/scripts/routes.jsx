// dependencies ----------------------------------------------------------

import React from 'react';
import {NotFoundRoute, DefaultRoute, Route} from 'react-router';
import requireAuth from './utils/requireAuth';

// views
import Index          from './common/index.jsx';
import Signin         from './user/signin.component.jsx';
import Admin          from './user/user.admin.jsx';
import Dashboard      from './dashboard/dashboard.component.jsx';
import Notifications  from './dashboard/notifications.component.jsx';
import Datasets       from './dashboard/datasets.component.jsx';
import PublicDatasets from './public/public.datasets.jsx';
import Dataset        from './dataset/dataset.jsx';
import Jobs           from './dashboard/jobs.component.jsx';

// redirects -------------------------------------------------------------

class RedirectDashboard extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('dashboard');
	}
}

class RedirectNotifications extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('notifications');
	}
}

// routes ----------------------------------------------------------------

// authenticated routes
Dashboard = requireAuth(Dashboard);
Admin     = requireAuth(Admin, 'admin');
// Dataset   = requireAuth(Dataset);

let routes = (
	<Route name="app" path="/" handler={Index}>
		
		<Route name="signIn" path="sign-in" handler={Signin}/>
		<Route name="admin" path="admin" handler={Admin}/>
		<Route name="dashboard" path="dashboard"  handler={Dashboard} >
			<Route name="notifications" path="notifications" handler={Notifications}/>
			<Route name="datasets" path="datasets" handler={Datasets}/>
			<Route name="jobs" path="jobs" handler={Jobs}/>
			<NotFoundRoute handler={RedirectNotifications}/>
		</Route>
		<Route name="public" path="public" handler={PublicDatasets}/>
		<Route name="dataset" path="dataset/:datasetId" handler={Dataset} />
		<DefaultRoute handler={RedirectDashboard}/>
		<NotFoundRoute handler={RedirectDashboard}/>	

	</Route>
);

export default routes;

