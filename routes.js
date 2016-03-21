// dependencies ------------------------------------

import express    from 'express';
import users      from './handlers/users';
import jobs       from './handlers/jobs';
import validation from './handlers/validation';
import auth       from './libs/auth';

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
	{
		method: 'put',
		url: '/users/:userId/preferences',
		middleware: [auth.user],
		handler: users.updatePreferences
	},

	// validation ----------------------------------

	{
		method: 'post',
		url: '/datasets/:datasetId/validate',
		middleware: [auth.user],
		handler: validation.validateOne
	},

	// jobs ----------------------------------------

	{
		method: 'get',
		url: '/apps',
		middleware: [],
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
		middleware: [auth.optional],
		handler: jobs.listDatasetJobs
	},
	{
		method: 'delete',
		url: '/jobs/:datasetId',
		middleware: [auth.user],
		handler: jobs.deleteDatasetJobs
	},
	{
		method: 'post',
		url: '/jobs/:jobId/results',
		middleware: [],
		handler: jobs.results
	},
	{
		method: 'get',
		url: '/jobs/:jobId/results/:fileName/ticket',
		middleware: [auth.optional],
		handler: jobs.getDownloadTicket
	},
	{
		method: 'get',
		url: '/jobs/:jobId/results/:fileName',
		middleware: [],
		handler: jobs.downloadResults
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
