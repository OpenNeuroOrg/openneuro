// dependencies ------------------------------------------------------------

import config   from '../config';
import agave    from '../libs/agave';
import sanitize from '../libs/sanitize';
import mongo    from '../libs/mongo';
import scitran  from '../libs/scitran';
import validate from 'bids-validator'

let c = mongo.collections;

// handlers ----------------------------------------------------------------

/**
 * Validation
 *
 * Handlers for dataset validation.
 */
export default {

	/**
	 * Flag For Validation
	 */
	flag(req, res, next) {

		// get project id
		let datasetId = req.params.datasetId;

		// check if project id is queued already
		c.validationQueue.updateOne({_id: datasetId}, {_id: datasetId}, {upsert: true}).then((err, result) => {
			if (err) {res.send(err);}
			else {res.send('Dataset ' + datasetId + ' flagged for validation.');}
		});
	},

	/**
	 * Validate
	 *
	 * Executed by the cron runner. Searches for flagged datasets
	 * downloads them, validates them and updates their validation
	 * results.
	 */
	validate() {
		c.validationQueue.find().toArray((err, datasets) => {
			if (err) {
				/* HANDLE ERROR */
			}
			if (datasets && datasets.length > 0) {
				for (let dataset of datasets) {
					scitran.downloadSymlinkDataset(dataset._id, (err, hash) => {
						if (err && err.status == 404) {
							// remove validation flag if dataset can no longer be found
							c.validationQueue.findAndRemove({_id: dataset._id}, [], (err, doc) => {});
						} else {
							validate.BIDS(config.location + '/persistent/datasets/' + hash, {}, (errors, warnings) => {
								scitran.updateProject(dataset._id, {
									metadata: {
										validation: {errors, warnings}
									}
								}, (err, res) => {
									if (errors && errors.length > 0) {
										scitran.addTag('projects', dataset._id, 'invalid', (err, res) => {});
									} else {
										scitran.removeTag('projects', dataset._id, 'invalid', (err, res) => {});
									}
									c.validationQueue.findAndRemove({_id: dataset._id}, [], (err, doc) => {
										scitran.removeTag('projects', dataset._id, 'pendingValidation', (err, res) => {});
									});
								});
							});
						}
					});
				}
			}
		});
	},

	validateOne(req, res, next) {

		// get project id
		let datasetId = req.params.datasetId;
		console.log('datasetId:' + datasetId);

		scitran.downloadSymlinkDataset(datasetId, (err, hash) => {
			console.log(err, hash);
			if (err && err.status == 404) {
				// remove validation flag if dataset can no longer be found
				// c.validationQueue.findAndRemove({_id: dataset._id}, [], (err, doc) => {});
			} else {
				validate.BIDS('./persistent/datasets/' + hash, {}, (errors, warnings) => {
					let validation = {errors, warnings};
					scitran.updateProject(datasetId, {
						metadata: {validation}
					}, (err, res1) => {
						scitran.removeTag('projects', datasetId, 'pendingValidation', (err, res2) => {
							if (errors && errors.length > 0) {
								scitran.addTag('projects', datasetId, 'invalid', (err, res3) => {res.send(validation)});
							} else {
								scitran.removeTag('projects', datasetId, 'invalid', (err, res4) => {res.send(validation)});
							}
						});

					});
				});
			}
		});
	}

}
