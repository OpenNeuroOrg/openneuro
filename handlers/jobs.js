// dependencies ------------------------------------------------------------

import agave         from '../libs/agave';
import sanitize      from '../libs/sanitize';
import scitran       from '../libs/scitran';
import mongo         from '../libs/mongo';
import async         from 'async';
import config        from '../config';
import crypto        from 'crypto';
import archiver      from 'archiver';
import notifications from '../libs/notifications'

let c = mongo.collections;

// models ------------------------------------------------------------------

let models = {
    job: {
        appId:             'string, required',
        appLabel:          'string, required',
        appVersion:        'string, required',
        datasetId:         'string, required',
        datasetLabel:      'stirng, required',
        executionSystem:   'String, required',
        parameters:        'object, required',
        snapshotId:        'string, required',
        userId:            'string, required',
        batchQueue:        'string, required',
        memoryPerNode:     'number, required',
        nodeCount:         'number, required',
        processorsPerNode: 'number, required',
        input:             'string',
    }
};

// handlers ----------------------------------------------------------------

/**
 * Jobs
 *
 * Handlers for job actions.
 */
let handlers = {

    /**
     * GET Apps
     */
    getApps(req, res, next) {
        agave.api.listApps((err, resp) => {
            if (err) {return next(err);}
            let apps = [];
            async.each(resp.body.result, (app, cb) => {
                agave.api.getApp(app.id, (err, resp2) => {
                    if (resp2.body && resp2.body.result) {
                        apps.push(resp2.body.result);
                    }
                    cb();
                });
            }, () => {
                res.send(apps);
            });
        });
    },

    /**
     * POST Job
     */
    postJob(req, res, next) {
        sanitize.req(req, models.job, (err, job) => {
            if (err) {return next(err);}
            scitran.downloadSymlinkDataset(job.snapshotId, (err, hash) => {
                job.datasetHash = hash
                job.parametersHash = crypto.createHash('md5').update(JSON.stringify(job.parameters)).digest('hex');

                c.jobs.findOne({
                    appId:          job.appId,
                    datasetHash:    job.datasetHash,
                    parametersHash: job.parametersHash,
                    snapshotId:     job.snapshotId
                }, {}, (err, existingJob) => {
                    if (err){return next(err);}
                    if (existingJob) {
                        // allow retrying failed jobs
                        if (existingJob.agave && existingJob.agave.status === 'FAILED') {
                            handlers.retry({params: {jobId: existingJob.jobId}}, res, next);
                            return;
                        }
                        let error = new Error('A job with the same dataset and parameters has already been run.');
                        error.http_code = 409;
                        return next(error);
                    }

                    agave.submitJob(job, (err, resp) => {
                        if (err) {return next(err);}
                        res.send(resp);
                    });
                });
            }, {snapshot: true});
        });
    },

    /**
     * Retry
     */
    retry (req, res, next) {
        let jobId = req.params.jobId;

        // find job
        c.jobs.findOne({jobId}, {}, (err, job) => {
            if (err){return next(err);}
            if (!job) {
                let error = new Error('Could not find job.');
                error.http_code = 404;
                return next(error);
            }
            if (job.agave.status && job.agave.status === 'FINISHED') {
                let error = new Error('A job with the same dataset and parameters has already successfully finished.');
                error.http_code = 409;
                return next(error);
            }
            if (job.agave.status && job.agave.status !== 'FAILED') {
                let error = new Error('A job with the same dataset and parameters is currently running.');
                error.http_code = 409;
                return next(error);
            }

            // re-submit job with old job data
            agave.submitJob(job, (err, resp) => {
                if (err) {
                    return next(err)
                } else {
                    // delete old job
                    c.jobs.removeOne({jobId}, {}, (err, doc) => {
                        if (err) {return next(err);}
                        res.send(resp);
                    });
                }
            });
        });
    },

    /**
     *  GET Dataset Jobs
     */
    getDatasetJobs(req, res, next) {
        let snapshot   = req.query.hasOwnProperty('snapshot') && req.query.snapshot == 'true';
        let datasetId  = req.params.datasetId;
        let user       = req.user;
        let hasAccess  = req.hasAccess;

        let query = snapshot ? {snapshotId: datasetId} : {datasetId};
        c.jobs.find(query).toArray((err, jobs) => {
            if (err) {return next(err);}
            if (snapshot) {
                if (!hasAccess) {
                    let error = new Error('You do not have access to view jobs for this dataset.');
                    error.http_code = 403;
                    return next(error);
                }
                // remove user ID on public requests
                if (!user) {
                    for (let job of jobs) {delete job.userId;}
                }
                res.send(jobs);
            } else {
                scitran.getProjectSnapshots(datasetId, (err, resp) => {
                    let snapshots = resp.body;
                    let filteredJobs = [];
                    for (let job of jobs) {
                        for (let snapshot of snapshots) {
                            if ((snapshot.public || hasAccess) && (snapshot._id === job.snapshotId)) {
                                if (!user) {delete job.userId;}
                                filteredJobs.push(job);
                            }
                        }
                    }
                    res.send(filteredJobs);
                });
            }
        });
    },

    /**
     * POST Results
     */
    postResults(req, res) {
        let jobId = req.params.jobId;
        c.jobs.findOne({jobId}, {}, (err, job) => {
            if (!job || job.agave.status === 'FAILED' || job.agave.status === 'FINISHED') {
                // occasionally result webhooks callback before the
                // original job submission is saved or after the job
                // is complete. in these cases do nothing.
                res.send({});
            } else if (req.body.status === job.agave.status) {
                res.send(job);
            } else if (req.body.status === 'FINISHED' || req.body.status === 'FAILED') {
                agave.getOutputs(jobId, (results, logs) => {
                    c.jobs.updateOne({jobId}, {$set: {agave: req.body, results, logs}}, {}).then((err, result) => {
                        if (err) {res.send(err);}
                        else {res.send(result);}
                        job.agave = req.body;
                        job.results = results;

                        notifications.jobComplete(job);
                    });
                });
            } else {
                c.jobs.updateOne({jobId}, {$set: {agave: req.body}}, {}, (err, result) => {
                    if (err) {res.send(err);}
                    else {res.send(result);}
                });
            }
        });
    },

    /**
     * GET Job
     */
    getJob(req, res) {
        let jobId = req.params.jobId;
        c.jobs.findOne({jobId}, {}, (err, job) => {
            let status = job.agave.status;

            // check if job is already known to be completed
            if ((status === 'FINISHED' && job.results && job.results.length > 0) || status === 'FAILED') {
                res.send(job);
            } else {
                agave.api.getJob(jobId, (err, resp) => {
                    // check status
                    if (resp.body.status === 'error' && resp.body.message.indexOf('No job found with job id') > -1) {
                        job.agave.status = 'FAILED';
                        c.jobs.updateOne({jobId}, {$set: {agave: job.agave}}, {}, (err, result) => {
                            res.send({agave: resp.body.result, snapshotId: job.snapshotId});
                            notifications.jobComplete(job);
                        });
                    } else if (resp.body && resp.body.result && (resp.body.result.status === 'FINISHED' || resp.body.result.status === 'FAILED')) {
                        job.agave = resp.body.result;
                        agave.getOutputs(jobId, (results, logs) => {
                            c.jobs.updateOne({jobId}, {$set: {agave: resp.body.result, results, logs}}, {}, (err, result) => {
                                if (err) {res.send(err);}
                                else {res.send({agave: resp.body.result, results, logs, snapshotId: job.snapshotId});}
                                job.agave = resp.body.result;
                                job.results = results;
                                job.logs = logs;
                                if (status !== 'FINISHED') {notifications.jobComplete(job);}
                            });
                        });
                    } else if (resp.body && resp.body.result && job.agave.status !== resp.body.result.status) {
                        job.agave = resp.body.result;
                        c.jobs.updateOne({jobId}, {$set: {agave: resp.body.result}}, {}, (err, result) => {
                            if (err) {res.send(err);}
                            else {
                                res.send({
                                    agave:      resp.body.result,
                                    datasetId:  job.datasetId,
                                    snapshotId: job.snapshotId,
                                    jobId:      jobId
                                });
                            }
                        });
                    } else {
                        res.send({
                            agave:      resp.body.result,
                            datasetId:  job.datasetId,
                            snapshotId: job.snapshotId,
                            jobId:      jobId
                        });
                    }
                });
            }
        });
    },

    /**
     * GET Download Ticket
     */
    getDownloadTicket(req, res, next) {
        let jobId    = req.params.jobId,
            filePath = req.query.filePath,
            fileName = filePath.split('/')[filePath.split('/').length - 1];
        c.jobs.findOne({jobId}, {}, (err, job) => {
            // check for job
            if (err){return next(err);}
            if (!job) {
                let error = new Error('Could not find job.');
                error.http_code = 404;
                return next(error);
            }

            // form ticket
            let ticket = {
                type: 'download',
                userId: req.user,
                jobId: jobId,
                fileName: fileName,
                filePath: filePath,
                created: new Date()
            };

            // Create and return ticket
            c.tickets.insertOne(ticket, (err) => {
                if (err) {return next(err);}
                c.tickets.ensureIndex({created: 1}, {expireAfterSeconds: 60 * 60}, () => {
                    res.send(ticket);
                });
            });
        });
    },

    /**
     * GET File
     */
    getFile(req, res, next) {
        let jobId = req.params.jobId;

        const path = req.ticket.filePath;
        if (path === 'all-results' || path === 'all-logs') {

            const type = path.replace('all-', '');

            // initialize archive
            let archive = archiver('zip');

            // log archiving errors
            archive.on('error', (err) => {
                console.log('archiving error - job: ' + jobId);
                console.log(err);
            });

            c.jobs.findOne({jobId}, {}, (err, job) => {
                let archiveName = job.datasetLabel + '__' + job.appId + '__' + type;

                // set archive name
                res.attachment(archiveName + '.zip');

                // begin streaming archive
                archive.pipe(res);

                // recurse outputs
                getOutputs(archiveName, job[type], type, archive, () => {
                    archive.finalize();
                });
            });

        } else {
            // download individual file
            agave.api.getPathProxy('jobs/v2/' + jobId + '/outputs/media' + path, res);
        }

        // recurse through tree outputs
        function getOutputs(archiveName, results, type, archive, callback) {
            const baseDir = type === 'results' ? '/out/' : '/log/';
            async.eachSeries(results, (result, cb) => {
                let outputName = result.path.replace(baseDir, archiveName + '/');
                if (result.type === 'file') {
                    let path = 'jobs/v2/' + jobId + '/outputs/media' + result.path;
                    let name = result.name;
                    agave.api.getPath(path, (err, res, token) => {
                        let body = res.body;
                        if (body && body.status && body.status === 'error') {
                            // error from AGAVE
                            console.log('Error downloading - ', path);
                            console.log(body);
                        } else {
                            // stringify JSON
                            if (typeof body === 'object' && !Buffer.isBuffer(body)) {
                                body = JSON.stringify(body);
                            }
                            // stringify numbers
                            if (typeof body === 'number') {
                                body = body.toString();
                            }
                            // handle empty files
                            if (typeof body === 'undefined') {
                                body = '';
                            }
                            // append file to archive
                            archive.append(body, {name: outputName});
                        }
                        cb();
                    });
                } else if (result.type === 'dir') {
                    archive.append(null, {name: outputName + '/'});
                    getOutputs(archiveName, result.children, type, archive, cb);
                } else {
                    cb();
                }
            }, callback);
        }

    },

    /**
     * DELETE Dataset Jobs
     *
     * Takes a dataset ID url parameter and deletes all jobs for that dataset.
     */
    deleteDatasetJobs(req, res, next) {
        let datasetId = req.params.datasetId;

        scitran.getProject(datasetId, (err, resp) => {
            if (resp.statusCode == 400) {
                let error = new Error('Bad request');
                error.http_code = 400;
                return next(error);
            }
            if (resp.statusCode == 404) {
                let error = new Error('No dataset found');
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
                    res.send({message: doc.result.n + ' job(s) have been deleted for dataset ' + datasetId});
                });
            } else {
                let message = resp.body.public ? 'You don\'t have permission to delete results from public datasets' : 'You don\'t have permission to delete jobs from this dataset.';
                let error = new Error(message);
                error.http_code = 403;
                return next(error);
            }
        });
    }

};

export default handlers;