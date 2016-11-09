// dependencies ------------------------------------------------------------

import config   from '../config';
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
	 * Validate
	 */
	validate(req, res, next) {
		// get project id
		let datasetId = req.params.datasetId;

		scitran.downloadSymlinkDataset(datasetId, (err, hash) => {
			validate.BIDS(config.location + '/persistent/datasets/' + hash, {}, (validation, summary) => {
				scitran.updateProject(datasetId, {
					metadata: {validation, summary}
				}, (err, res1) => {
					scitran.removeTag('projects', datasetId, 'validating', (err, res2) => {
						if (validation.errors && validation.errors.length > 0) {
							scitran.addTag('projects', datasetId, 'invalid', (err, res3) => {res.send({validation, summary})});
						} else {
							scitran.removeTag('projects', datasetId, 'invalid', (err, res4) => {res.send({validation, summary})});
						}
					});
				});
			});
		});
	}

}
