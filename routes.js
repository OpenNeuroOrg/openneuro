// dependencies ------------------------------------

import express  from 'express';
import users    from './handlers/users';
import jobs     from './handlers/jobs';
import datasets from './handlers/datasets';
import auth     from './libs/auth';

let routes = [

	// users ---------------------------------------

	{
		method: 'post',
		url: '/users',
		middleware: [],
		handler: users.create
	},
	{
		method: 'post',
		url: '/users/blacklist',
		middleware: [auth.superuser],
		handler: users.blacklist
	},
	{
		method: 'get',
		url: '/users/blacklist',
		middleware: [auth.superuser],
		handler: users.getBlacklist
	},
	{
		method: 'delete',
		url: '/users/blacklist/:id',
		middleware: [auth.superuser],
		handler: users.unBlacklist
	},

	// validation ----------------------------------

	{
		method: 'post',
		url: '/datasets/:datasetId/validate',
		middleware: [auth.user],
		handler: datasets.validate
	},

	// jobs ----------------------------------------

	{
		method: 'get',
		url: '/apps',
		middleware: [auth.user],
		handler: jobs.listApps
	},
	{
		method: 'post',
		url: '/jobs',
		middleware: [auth.user],
		handler: jobs.create
	},
	{
		method: 'get',
		url: '/jobs/:datasetId',
		middleware: [auth.user],
		handler: jobs.listDatasetJobs
	},
	{
		method: 'post',
		url: '/jobs/results',
		middleware: [],
		handler: jobs.results
	}

];

// initialize routes -------------------------------

let router = express.Router();

for (let route of routes) {
	let middleware = route.middleware ? route.middleware : [];
	let arr = route.middleware;
		arr.unshift(route.url);
		arr.push(route.handler);
	router[route.method].apply(router, arr);
}

// export ------------------------------------------

export default router;
