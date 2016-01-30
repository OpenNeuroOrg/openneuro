// dependencies ----------------------------------------------------------

import React from 'react';
import {NotFoundRoute, DefaultRoute, Route} from 'react-router';
import requireAuth from './utils/requireAuth';

// views
import Index          from './index.jsx';
import Signin         from './user/signin.jsx';

import Admin          from './admin/admin.jsx';
import Users          from './admin/admin.users.jsx';
import Blacklist      from './admin/admin.blacklist.jsx';

import Dashboard      from './dashboard/dashboard.jsx';
import Notifications  from './dashboard/notifications.jsx';
import Jobs           from './dashboard/jobs.jsx';
import Datasets       from './dashboard/datasets.jsx';
import Dataset        from './dataset/dataset.jsx';


// redirects -------------------------------------------------------------

class RedirectDashboard extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('dashboard');
	}
}

class RedirectNotifications extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('datasets');
	}
}

class RedirectUsers extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('users');
	}
}

// routes ----------------------------------------------------------------

// authenticated routes
Dashboard = requireAuth(Dashboard);
Admin     = requireAuth(Admin, 'admin');

let routes = (
	<Route name="app" path="/" handler={Index}>
		<Route name="signIn" path="sign-in" handler={Signin}/>
		<Route name="dashboard" path="dashboard"  handler={Dashboard} >
			<Route name="datasets" path="datasets" handler={Datasets}/>
			<Route name="notifications" path="notifications" handler={Notifications}/>
			<Route name="jobs" path="jobs" handler={Jobs}/>
			<NotFoundRoute handler={RedirectNotifications}/>
		</Route>
		<Route name="admin" path="admin" handler={Admin} >
			<Route name="users" path="users" handler={Users} />
			<Route name="blacklist" path="blacklist" handler={Blacklist} />
			<NotFoundRoute handler={RedirectUsers}/>
		</Route>
		<Route name="public" path="public" handler={Datasets}/>
		<Route name="dataset" path="dataset/:datasetId" handler={Dataset} />
		<Route name="snapshot" path="snapshot/:snapshotId" handler={Dataset} />
		<DefaultRoute handler={RedirectDashboard}/>
		<NotFoundRoute handler={RedirectDashboard}/>
	</Route>
);

export default routes;

