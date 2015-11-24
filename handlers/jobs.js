// dependencies ------------------------------------------------------------

import agave    from '../libs/agave';
import sanitize from '../libs/sanitize';
import mongo    from '../libs/mongo';
import async    from 'async';

let c = mongo.collections;


// models ------------------------------------------------------------------

let models = {
	job: {
		name:       'string, required',
		appId:      'string, required',
		datasetId:  'string, required',
		userId:     'string, required',
		parameters: 'object, required'
	}
}

// handlers ----------------------------------------------------------------

/**
 * Jobs
 *
 * Handlers for job actions.
 */
export default {

	/**
	 * List Apps
	 */
	listApps(req, res, next) {
		agave.listApps((err, resp) => {
			if (err) {return next(err);}
			let apps = resp.body.result;
			async.each(apps, (app, cb) => {
				agave.getApp(app.id, (err, resp2) => {
					app.parameters = resp2.body.result.parameters;
					cb();
				});
			}, () => {
				res.send(resp.body.result);
			});
		});
	},

	/**
	 * Create Job
	 */
	create(req, res, next) {
		sanitize.req(req, models.job, (err, job) => {
			if (err) {return next(err);}

			let body = {
				name: job.name,
				appId: job.appId,
				batchQueue: "normal",
				executionSystem: "slurm-stampede.tacc.utexas.edu",
				maxRunTime: "00:20:00",
				memoryPerNode: "8GB",
				nodeCount: 1,
				processorsPerNode: 16,
				archive: true,
				archiveSystem: "openfmri-storage",
				archivePath: null,
				inputs: {
					bidsFile: "agave://openfmri-storage/ds003_downsampled.tar"
				},
				parameters: job.parameters,
				notifications: [
					{
						url:"http://scitran.sqm.io:8765/api/v1/jobs/results",
						event:"*",
						persistent:true
					}
				]
			};

			agave.createJob(body, (err, resp) => {
				if (err) {return next(err);}
				c.jobs.insertOne({
					name:      job.name,
					appId:     job.appId,
					datasetId: job.datasetId,
					userId:    job.userId,
					jobId:     resp.body.result.id,
					agave:     resp.body.result
				}, () => {
					res.send(resp.body);
				});
			});
		});
	},

	/**
	 * List Jobs
	 */
	listDatasetJobs(req, res, next) {
		let datasetId = req.params.datasetId;
		let user = req.user;
		c.jobs.find({userId: user, datasetId: datasetId}).toArray((err, jobs) => {
			if (err) {return next(err);}
			res.send(jobs);
		});
	},

	/**
	 *	Results
	 */
	results(req, res, next) {
		console.log(req.body.status);
		if (req.body.status === 'FINISHED') {
			agave.getJobOutput(req.body.id, (err, resp) => {
				console.log(resp.body.result);
				c.jobs.updateOne({jobId: req.body.id}, {$set: {agave: req.body, results: resp.body.result}}, {}).then((err, result) => {
					if (err) {res.send(err);}
					else {res.send(result);}
				});
			});
		} else {
			c.jobs.updateOne({jobId: req.body.id}, {$set: {agave: req.body}}, {}).then((err, result) => {
				if (err) {res.send(err);}
				else {res.send(result);}
			});
		}
	}

	/**
	 * Example Result
		{
		    id: '463956452580453915-e0bd34dffff8de6-0001-007',
		    name: 'openfmri-agave-bids-test test-1446118141',
		    owner: 'oesteban',
		    appId: 'openfmri-agave-bids-test-0.2.0',
		    executionSystem: 'openfmri-stampede.tacc.utexas.edu',
		    batchQueue: 'normal',
		    nodeCount: 1,
		    processorsPerNode: 1,
		    memoryPerNode: 1,
		    maxRunTime: '01:00:00',
		    archive: true,
		    retries: 0,
		    localId: '6008509',
		    created: '2015-11-06T12:12:43.000-06:00',
		    archivePath: 'oesteban/archive/jobs/job-463956452580453915-e0bd34dffff8de6-0001-007',
		    archiveSystem: 'docking.storage',
		    outputPath: '/scratch/03763/oesteban/oesteban/job-463956452580453915-e0bd34dffff8de6-0001-007-openfmri-agave-bids-test-test-1446118141',
		    status: 'FINISHED',
		    submitTime: '2015-11-06T12:13:36.000-06:00',
		    startTime: null,
		    endTime: '2015-11-06T12:28:33.000-06:00',
		    inputs: {
		        bidsFile: 'agave://openfmri-corral-storage/ds003_downsampled.tar'
		    },
		    parameters: {
		        slurmQueue: 'test'
		    },
		    _links: {
		        self: {
		            href: 'https://api.tacc.utexas.edu/jobs/v2/463956452580453915-e0bd34dffff8de6-0001-007'
		        },
		        app: {
		            href: 'https://api.tacc.utexas.edu/apps/v2/openfmri-agave-bids-test-0.2.0'
		        },
		        executionSystem: {
		            href: 'https://api.tacc.utexas.edu/systems/v2/openfmri-stampede.tacc.utexas.edu'
		        },
		        archiveSystem: {
		            href: 'https://api.tacc.utexas.edu/systems/v2/docking.storage'
		        },
		        archiveData: {
		            href: 'https://api.tacc.utexas.edu/files/v2/listings/system/docking.storage/oesteban/archive/jobs/job-463956452580453915-e0bd34dffff8de6-0001-007'
		        },
		        owner: {
		            href: 'https://api.tacc.utexas.edu/profiles/v2/oesteban'
		        },
		        permissions: {
		            href: 'https://api.tacc.utexas.edu/jobs/v2/463956452580453915-e0bd34dffff8de6-0001-007/pems'
		        },
		        history: {
		            href: 'https://api.tacc.utexas.edu/jobs/v2/463956452580453915-e0bd34dffff8de6-0001-007/history'
		        },
		        metadata: {
		            href: 'https://api.tacc.utexas.edu/meta/v2/data/?q={"associationIds":"463956452580453915-e0bd34dffff8de6-0001-007"}'
		        },
		        notifications: {
		            href: 'https://api.tacc.utexas.edu/notifications/v2/?associatedUuid=463956452580453915-e0bd34dffff8de6-0001-007'
		        }
		    }
		}
	*/

}