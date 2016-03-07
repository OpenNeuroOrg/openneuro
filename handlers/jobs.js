// dependencies ------------------------------------------------------------

import agave      from '../libs/agave';
import sanitize   from '../libs/sanitize';
import scitran    from '../libs/scitran';
import mongo      from '../libs/mongo';
import async      from 'async';
import config     from '../config';
import {ObjectID} from 'mongodb';
import crypto     from 'crypto';

let c = mongo.collections;


// models ------------------------------------------------------------------

let models = {
	job: {
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
				    if (resp2.body && resp2.body.result && resp2.body.result.parameters) {
					app.parameters = resp2.body.result.parameters;
				    }
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
			scitran.downloadSymlinkDataset(job.datasetId, (err, hash) => {
				let parametersHash = crypto.createHash('md5').update(JSON.stringify(job.parameters)).digest('hex');
				let jobName = 'crn-automated-job'

				/* qap body*/
				// let body = {
				// 	name: jobName,
				// 	appId: job.appId,
				// 	batchQueue: "normal",
				// 	executionSystem: "slurm-stampede.tacc.utexas.edu",
				// 	maxRunTime: "00:20:00",
				// 	memoryPerNode: "8GB",
				// 	nodeCount: 1,
				// 	processorsPerNode: 16,
				// 	archive: true,
				// 	archiveSystem: "openfmri-storage",
				// 	archivePath: null,
				// 	inputs: {
				// 		bidsFile: "agave://openfmri-storage/ds003_downsampled.tar"
				// 	},
				// 	parameters: job.parameters,
				// 	notifications: [
				// 		{
				// 			url: config.url + ':' + config.port + '/api/v1/jobs/${JOB_ID}/results',
				// 			event:"*",
				// 			persistent:true
				// 		}
				// 	]
				// };


				let body = {
					"name": jobName,
					"appId": "mriqcp-0.1.0",
					"batchQueue": "normal",
					"executionSystem": "slurm-ls5.tacc.utexas.edu",
					"maxRunTime": "04:00:00",
					"memoryPerNode": "4GB",
					"nodeCount": 1,
					"processorsPerNode": 8,
					"archive": true,
					"archiveSystem": "openfmri-storage",
					"archivePath": null,
					"inputs": {
						"bidsFile": "agave://crn-dev-storage/" + hash
					},
					"parameters": {
					},
					"notifications": [
						{
							"url": config.url + ':' + config.port + '/api/v1/jobs/${JOB_ID}/results',
							"event":"*",
							"persistent":true
						}
					]
				};

				c.jobs.findOne({appId: job.appId, datasetId: job.datasetId, datasetHash: hash, parametersHash: parametersHash}, {}, (err, existingJob) => {
					if (err){return next(err);}
					if (existingJob) {
						let error = new Error("A job with the same dataset and parameters has already been run.");
						error.http_code = 409;
						return next(error);
					}
					agave.createJob(body, (err, resp) => {
						if (resp.body.status == 'error') {
							let error = new Error(resp.body.message);
							error.http_code = 400;
							return next(error);
						}
						c.jobs.insertOne({
							name:           jobName,
							appId:          job.appId,
							datasetId:      job.datasetId,
							datasetHash:    hash,
							userId:         job.userId,
							jobId:          resp.body.result.id,
							agave:          resp.body.result,
							parameters:     job.parameters,
							parametersHash: parametersHash
						}, () => {
							res.send(resp.body);
						});
					});
				});
			}, {snapshot: true});
		});
	},

	/**
	 *  List Jobs
	 */
	listDatasetJobs(req, res, next) {
		let snapshot  = req.query.hasOwnProperty('snapshot') && req.query.snapshot == 'true';
		let datasetId = req.params.datasetId;
		let user      = req.user;

		scitran.getProject(datasetId, (err, resp) => {
			if (resp.body.code && resp.body.code == 404) {
				let error = new Error(resp.body.detail);
				error.http_code = 404;
				return next(error);
			}

			let hasAccess = !!resp.body.public || req.isSuperUser;
			if (resp.body.permissions && !hasAccess) {
				for (let permission of resp.body.permissions) {
					if (permission._id == user) {hasAccess = true; break;}
				}
				if (!hasAccess) {
					let error = new Error('You do not have access to view jobs for this dataset.');
					error.http_code = 403;
					return next(error);
				}
			}

			c.jobs.find({datasetId: datasetId}).toArray((err, jobs) => {
				if (err) {return next(err);}
				res.send(jobs);
			});

		}, {snapshot});
	},

	/**
	 *	Results
	 */
	results(req, res, next) {
		let jobId = req.params.jobId;
		if (req.body.status === 'FINISHED') {
			agave.getJobOutput(req.body.id, (err, resp) => {
				c.jobs.updateOne({jobId}, {$set: {agave: req.body, results: resp.body.result}}, {}).then((err, result) => {
					if (err) {res.send(err);}
					else {res.send(result);}
				});
			});
		} else {
			c.jobs.updateOne({jobId}, {$set: {agave: req.body}}, {}).then((err, result) => {
				if (err) {res.send(err);}
				else {res.send(result);}
			});
		}
	},

	/**
	 * Get Download Ticket
	 */
	getDownloadTicket(req, res, next) {
		let jobId    = req.params.jobId,
			fileName = req.params.fileName;
		c.jobs.findOne({jobId}, {}, (err, job) => {
			if (err){return next(err);}
			if (!job) {
				let error = new Error("Could not find job.");
				error.http_code = 404;
				return next(error);
			}
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
					let ticket = {
						type: 'download',
						userId: req.user,
						jobId: jobId,
						fileName: fileName,
						created: new Date()
					};
					// Create and return token
					c.tickets.insertOne(ticket, (err, result) => {
						if (err) {return next(err);}
						c.tickets.ensureIndex({created: 1}, {expireAfterSeconds: 60}, (err, index) => {
							res.send(ticket);
						});
					});
				} else {
					let error = new Error("You do not have permission to access this file.");
					error.http_code = 403;
					return next(error);
				}
			}, {snapshot: true});
		});
	},

	/**
	 * Download Results
	 */
	downloadResults(req, res, next) {
		let ticket   = req.query.ticket,
			fileName = req.params.fileName,
			jobId    = req.params.jobId;

		if (!ticket) {
			let error = new Error("No download ticket query parameter found.");
			error.http_code = 400;
			return next(error);
		}

		c.tickets.findOne({_id: ObjectID(ticket), type: 'download', fileName: fileName, jobId: jobId}, {}, (err, result) => {
			if (err) {return next(err);}
			if (!result) {
				let error = new Error("Download ticket was not found or expired");
				error.http_code = 401;
				return next(error);
			}
			let path = 'https://api.tacc.utexas.edu/jobs/v2/' + req.params.jobId + '/outputs/media/out/' + req.params.fileName;

			agave.getFile(path, (err, resp) => {
				res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
				res.setHeader('Content-type', resp.headers['content-type']);
				res.send(resp.body);
			});
		});

	},

	/**
	 * Delete Dataset Jobs
	 *
	 * Takes a dataset ID url parameter and deletes all jobs for that dataset.
	 */
	deleteDatasetJobs(req, res, next) {
		let datasetId = req.params.datasetId;

		scitran.getProject(datasetId, (err, resp) => {
			if (resp.statusCode == 400) {
				let error = new Error("Bad request");
				error.http_code = 400;
				return next(error);
			}
			if (resp.statusCode == 404) {
				let error = new Error("No dataset found");
				error.http_code = 404;
				return next(error);
			}

			let hasPermission;
			if (!req.user) {
				hasPermission = false;
			} else {
				for (let permission of resp.body.permissions) {
					if (req.user === permission._id && permission.access === 'admin') {
						hasPermission = true;
						break;
					}
				}
			}
			if (!resp.body.public && hasPermission) {
				c.jobs.deleteMany({datasetId}, [], (err, doc) => {
					if (err) {return next(err);}
					res.send({message: doc.result.n + " job(s) have been deleted for dataset " + datasetId});
				});
			} else {
				let message = resp.body.public ? "You don't have permission to delete results from public datasets" : "You don't have permission to delete jobs from this dataset.";
				let error = new Error(message);
				error.http_code = 403;
				return next(error);
			}
		});
	}

}
