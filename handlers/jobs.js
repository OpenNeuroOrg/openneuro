// dependencies ------------------------------------------------------------

import agave    from '../libs/agave';
import sanitize from '../libs/sanitize';
import scitran  from '../libs/scitran';
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
	 *  List Jobs
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
		if (req.body.status === 'FINISHED') {
			agave.getJobOutput(req.body.id, (err, resp) => {
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
	},

	// getDownloadTicket(jobId, filename)
		// get job by id
			// check datasetId
				// getdataset from scitran
					// check if user has permissions on dataset
						// if no
							// throw error
						// if yes
							// create download token
								/*{
									id: objectId,
									userId: userId,
									jobId: jobId,
									filename: filename
								}*/

	getDownloadTicket(req, res, next) {
		let jobId    = req.query.jobId,
			fileName = req.query.fileName;
		c.jobs.findOne({jobId}, {}, (err, job) => {
			if (err){return next(err);}
			// need error if file not found.
			scitran.getProject(job.datasetId, (err, resp) => {
				let hasPermission;
				if (!req.user) {
					hasPermission = false;
				} else {
					for (let permission of resp.body.permissions) {
						if (req.user === permission._id) {
							hasPermission = true;
							break;
						}
					}
				}
				if (resp.body.public || hasPermission) {
					// Create and return token
					console.log('generate token');
				} else {
					let error = new Error("You do not have permission to access this file.");
					error.http_code = 403;
					return next(error);
				}
			});
		});
	},

	// getFile(jobId, filename, token)
		// find token that matches {tokenId, userId, filename}
			// if not found
				// throw error
			// if found
				// proxy file request from agave

	downloadResults(req, res, next) {
		let path = req.query.path;

		agave.getFile(path, (err, resp) => {
			let filePath = resp.request.uri.path.split('/');
			let filename = filePath[filePath.length -1];
			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', resp.headers['content-type']);
			res.send(resp.body);
		});
	}

}