// dependencies ------------------------------------------------------------

import agave    from '../libs/agave';
import sanitize from '../libs/sanitize';
import mongo    from '../libs/mongo';

let c = mongo.collections;


// models ------------------------------------------------------------------

let models = {
	job: {
		name:      'string, required',
		appId:     'string, required',
		datasetId: 'string, required',
		userId:    'string, required'
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
	 * Create Job
	 */
	create(req, res, next) {
		sanitize.req(req, models.job, (err, job) => {
			if (err) {return next(err);}

			let body = {
				name: job.name,
				appId: job.appId,
				executionSystem: 'openfmri-stampede.tacc.utexas.edu',
				maxRunTime: '01:00:00',
				memoryPerNode: '1GB',
				nodeCount: 1,
				processorsPerNode: 1,
				archive: true,
				archiveSystem: 'docking.storage',
				archivePath: null,
				bidsFile: 'agave://openfmri-corral-storage/' + datasetId + '.tar',
				notification: [
					{
						url: 'http://scitran.sqm.io:8765/api/v1/jobs/results',
						event: '*',
						persistent: true
					}
				]
			};

			agave.createJob(body, (err, res) => {
				if (err) {return next(err);}
				c.jobs.insertOne({
					name:      job.name,
					appId:     job.appId,
					datasetId: job.datasetId,
					userId:    job.userId,
					response:  res.body
				});
			});
		});
	},

	/**
	 *	Results
	 */
	results(req, res, next) {
		console.log(req.path);
		console.log(req.body);
		res.send({});
	}


}