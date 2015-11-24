// dependencies ------------------------------------------------------------

import agave    from '../libs/agave';
import sanitize from '../libs/sanitize';
import mongo    from '../libs/mongo';

// models ------------------------------------------------------------------

let models = {

}

// handlers ----------------------------------------------------------------

/**
 * Datasets
 *
 * Handlers for dataset actions.
 */
export default {

	/**
	 * Validate
	 */
	validate(req, res, next) {

		// get project id
		let datasetId = req.params.datasetId;

		// check if project id is queued already
		let validationQueue = mongo.db.collection('validationQueue');
		validationQueue.updateOne({_id: datasetId}, {_id: datasetId}, {upsert: true}).then((err, result) => {
			if (err) {res.send(err);}
			else {res.send(result);}
		});
	},

	// Chron Validator
		// every 10 minutes
			// Remove projects to validate out of mongo and into memory
				// iterate over projects in memory and run validation process
					// update validation note on each project

}