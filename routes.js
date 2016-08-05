// dependencies ------------------------------------

import express    from 'express';
import users      from './handlers/users';
import jobs       from './handlers/jobs';
import validation from './handlers/validation';
import auth       from './libs/auth';
import scitran    from './libs/scitran';
import config     from './config';

let routes = [

	// users ---------------------------------------

	{
		method: 'get',
		url: '/users/self',
		middleware: [],
		handler: scitran.verifyUser
	},
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
		handler: validation.validate
	},

	// jobs ----------------------------------------

	{
		method: 'get',
		url: '/apps',
		middleware: [],
		handler: jobs.getApps
	},
	{
		method: 'post',
		url: '/datasets/:datasetId/jobs',
		middleware: [auth.datasetAccess],
		handler: jobs.postJob
	},
	{
		method: 'get',
		url: '/datasets/:datasetId/jobs',
		middleware: [auth.datasetAccess],
		handler: jobs.getDatasetJobs
	},
	{
		method: 'delete',
		url: '/datasets/:datasetId/jobs',
		middleware: [auth.datasetAccess],
		handler: jobs.deleteDatasetJobs
	},
	{
		method: 'post',
		url: '/jobs/:jobId/results',
		middleware: [auth.fromOrigin(config.agave.url)],
		handler: jobs.postResults
	},
	{
		method: 'get',
		url: '/datasets/:datasetId/jobs/:jobId',
		middleware: [auth.datasetAccess],
		handler: jobs.getJob
	},
	{
		method: 'post',
		url: '/jobs/:jobId/retry',
		middleware: [auth.datasetAccess],
		handler: jobs.retry
	},
	{
		method: 'get',
		url: '/jobs/:jobId/results/ticket',
		middleware: [auth.optional],
		handler: jobs.getDownloadTicket
	},
	{
		method: 'get',
		url: '/jobs/:jobId/results/:fileName',
		middleware: [],
		handler: jobs.getFile
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
