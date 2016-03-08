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
			if (datasets) {
				for (let dataset of datasets) {
					scitran.downloadSymlinkDataset(dataset._id, (err, hash) => {
						validate.BIDS(config.location + '/persistent/datasets/' + hash, {}, (errors, warnings) => {
							scitran.updateProject(dataset._id, {
								metadata: {
									validation: {errors, warnings}
								}
							}, (err, res) => {
								c.validationQueue.findAndRemove({_id: dataset._id}, [], (err, doc) => {
									scitran.removeTag('projects', dataset._id, 'pendingValidation', (err, res) => {

									});
								});
							});
						});
					});
				}
			}
		});
	}

}
