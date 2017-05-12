// dependencies ----------------------------------------------------------

import React from 'react';
import {NotFoundRoute, DefaultRoute, Route} from 'react-router';
import requireAuth from './utils/requireAuth';

// views
import Index          from './index.jsx';
import FrontPage      from './front-page/front-page.jsx';

import Admin          from './admin/admin.jsx';
import Users          from './admin/admin.users.jsx';
import Blacklist      from './admin/admin.blacklist.jsx';
import AppDefinitions from './admin/admin.apps.jsx';

import Dashboard      from './dashboard/dashboard.jsx';
import Notifications  from './dashboard/notifications.jsx';
import Jobs           from './dashboard/dashboard.jobs.jsx';
import Datasets       from './dashboard/dashboard.datasets.jsx';
import Dataset        from './dataset/dataset.jsx';


// redirects -------------------------------------------------------------

class RedirectDashboard extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('dashboard');
    }
}

class RedirectDatasets extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('datasets');
    }
}

class RedirectPublicDatasets extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('publicDatasets');
    }
}

class RedirectUsers extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('users');
    }
}

// routes ----------------------------------------------------------------

let routes = (
    <Route name="app" path="/" handler={Index}>
        <Route name="front-page" path="/" handler={FrontPage}/>
        <Route name="dashboard" path="dashboard"  handler={requireAuth(Dashboard)} >
            <Route name="datasets" path="datasets" handler={Datasets}/>
            <Route name="notifications" path="notifications" handler={Notifications}/>
            <Route name="jobs" path="jobs" handler={Jobs}/>
            <NotFoundRoute handler={RedirectDatasets}/>
        </Route>
        <Route name="publicDashboard" path="public"  handler={Dashboard} >
            <Route name="publicDatasets" path="datasets" handler={Datasets}/>
            <Route name="publicNotifications" path="notifications" handler={Notifications}/>
            <Route name="publicJobs" path="jobs" handler={Jobs}/>
            <NotFoundRoute handler={RedirectPublicDatasets}/>
        </Route>
        <Route name="admin" path="admin" handler={requireAuth(Admin, 'admin')} >
            <Route name="users" path="users" handler={Users} />
            <Route name="blacklist" path="blacklist" handler={Blacklist} />
            <Route name="app-definitions" path="app-definitions" handler={AppDefinitions} />
            <Route name="app-definitions-edit" path="app-definitions/:app-definitionsId" handler={AppDefinitions} />
            <NotFoundRoute handler={RedirectUsers}/>
        </Route>
        <Route name="dataset" path="datasets/:datasetId" handler={Dataset} />
        <Route name="snapshot" path="datasets/:datasetId/versions/:snapshotId" handler={Dataset} />
        <DefaultRoute handler={FrontPage}/>
        <NotFoundRoute handler={RedirectDashboard}/>
    </Route>
);

export default routes;
