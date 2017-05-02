/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies ------------------------------------------------------------

import agave         from '../libs/agave';
import scitran       from '../libs/scitran';
import mongo         from '../libs/mongo';
import async         from 'async';
import crypto        from 'crypto';
import archiver      from 'archiver';
import notifications from '../libs/notifications';
import {ObjectID}    from 'mongodb';

let c = mongo.collections;

// handlers ----------------------------------------------------------------

/**
 * Jobs
 *
 * Handlers for job actions.
 */
let handlers = {

    /**
     * GET Apps - original
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
     * POST Job - original
     */
    postJob(req, res, next) {
        let job = req.body;
        scitran.downloadSymlinkDataset(job.snapshotId, (err, hash) => {
            job.datasetHash = hash;
            job.parametersHash = crypto.createHash('md5').update(JSON.stringify(job.parameters)).digest('hex');

            c.crn.jobs.findOne({
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
                    res.status(409).send({message: 'A job with the same dataset and parameters has already been run.'});
                    return;
                }

                agave.submitJob(job, (err, resp) => {
                    if (err) {return next(err);}
                    res.send(resp);
                });
            });
        }, {snapshot: true});
    },

    /**
     * Retry
     */
    retry (req, res, next) {
        let jobId = req.params.jobId;

        // find job
        c.crn.jobs.findOne({jobId}, {}, (err, job) => {
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
                    return next(err);
                } else {
                    // delete old job
                    c.crn.jobs.removeOne({jobId}, {}, (err) => {
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
        c.crn.jobs.find(query).toArray((err, jobs) => {
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
        c.crn.jobs.findOne({jobId}, {}, (err, job) => {
            if (!job || job.agave.status === 'FAILED' || job.agave.status === 'FINISHED') {
                // occasionally result webhooks callback before the
                // original job submission is saved or after the job
                // is complete. in these cases do nothing.
                res.send({});
            } else if (req.body.status === job.agave.status) {
                res.send(job);
            } else if (req.body.status === 'FINISHED' || req.body.status === 'FAILED') {
                agave.getOutputs(jobId, (results, logs) => {
                    c.crn.jobs.updateOne({jobId}, {$set: {agave: req.body, results, logs}}, {}).then((err, result) => {
                        if (err) {res.send(err);}
                        else {res.send(result);}
                        job.agave = req.body;
                        job.results = results;

                        notifications.jobComplete(job);
                    });
                });
            } else {
                c.crn.jobs.updateOne({jobId}, {$set: {agave: req.body}}, {}, (err, result) => {
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
        c.crn.jobs.findOne({jobId}, {}, (err, job) => {
            let status = job.agave.status;

            // check if job is already known to be completed
            if ((status === 'FINISHED' && job.results && job.results.length > 0) || status === 'FAILED') {
                res.send(job);
            } else {
                agave.api.getJob(jobId, (err, resp) => {
                    // check status
                    if (resp.body.status === 'error' && resp.body.message.indexOf('No job found with job id') > -1) {
                        job.agave.status = 'FAILED';
                        c.crn.jobs.updateOne({jobId}, {$set: {agave: job.agave}}, {}, () => {
                            res.send({agave: resp.body.result, snapshotId: job.snapshotId});
                            notifications.jobComplete(job);
                        });
                    } else if (resp.body && resp.body.result && (resp.body.result.status === 'FINISHED' || resp.body.result.status === 'FAILED')) {
                        job.agave = resp.body.result;
                        agave.getOutputs(jobId, (results, logs) => {
                            c.crn.jobs.updateOne({jobId}, {$set: {agave: resp.body.result, results, logs}}, {}, (err) => {
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
                        c.crn.jobs.updateOne({jobId}, {$set: {agave: resp.body.result}}, {}, (err) => {
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

    getJobs(req, res) {
        c.crn.jobs.find().toArray((err, jobs) => {
            if (err) {
                res.send(err);
                return;
            }

            // store request metadata
            let availableApps = {};

            // filter jobs by permissions
            let filteredJobs = [];

            if (req.query.public === 'true') {
                async.each(jobs, (job, cb) => {
                    c.scitran.project_snapshots.findOne({'_id': ObjectID(job.snapshotId)}, {}, (err, snapshot) => {
                        if (snapshot && snapshot.public === true) {
                            buildMetadata(job);
                            filteredJobs.push(job);
                            cb();
                        } else {
                            cb();
                        }
                    });
                }, () => {
                    res.send({availableApps: reMapMetadata(availableApps), jobs: filteredJobs});
                });
            } else {
                for (let job of jobs) {
                    if (req.user === job.userId) {
                        buildMetadata(job);
                        filteredJobs.push(job);
                    }
                }
                res.send({availableApps: reMapMetadata(availableApps), jobs: filteredJobs});
            }

            function buildMetadata(job) {
                if (!availableApps.hasOwnProperty(job.appLabel)) {
                    availableApps[job.appLabel] = {versions: {}};
                    availableApps[job.appLabel].versions[job.appVersion] = job.appId;
                } else if (!availableApps[job.appLabel].versions.hasOwnProperty(job.appVersion)) {
                    availableApps[job.appLabel].versions[job.appVersion] = job.appId;
                }
            }

            function reMapMetadata(apps) {
                let remapped = [];
                for (let app in apps) {
                    let tempApp = {label: app, versions: []};
                    for (let version in apps[app].versions) {
                        tempApp.versions.push({
                            version,
                            id: apps[app].versions[version]
                        });
                    }
                    remapped.push(tempApp);
                }
                return remapped;
            }
        });
    },

    /**
     * GET Download Ticket
     */
    getDownloadTicket(req, res) {
        let jobId = req.params.jobId;
        // form ticket
        let ticket = {
            type: 'download',
            userId: req.user,
            jobId: jobId,
            fileName: 'all',
            created: new Date()
        };

        res.send(ticket);
    },

    /**
     * GET File
     */
    getFile(req, res) {
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

            c.crn.jobs.findOne({jobId}, {}, (err, job) => {
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
                    agave.api.getPath(path, (err, res) => {
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
                c.crn.jobs.deleteMany({datasetId}, [], (err, doc) => {
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