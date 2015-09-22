/**
 * Sanitize
 *
 * A simple request sanitizer. Compares a request
 * against a model and reports back errors or returns
 * a sanitized body.
 */
export default {
	req(req, model, callback) {
		let err = '';
		let res = {};
		for (let prop in model) {
			let value = req.body.hasOwnProperty(prop) ? req.body[prop] : null;

			// required
			if (model[prop].indexOf('required') > -1) {
				if (value === null) {
					err += 'Request must have property: ' + prop + '. ';
					continue;
				} 
			}

			// isString
			if (model[prop].indexOf('string') > -1) {
				if (typeof value !== 'string') {
					err += prop + ' must be a string. ';
				}
			}

			// if sanitary add value
			if (!err) {res[prop] = value}
		}
		callback(err, res);
	}
}