/**
 * Sanitize
 *
 * A simple request sanitizer. Compares a request
 * against a model and reports back errors or returns
 * a sanitized body.
 */
export default {
	req(req, model, callback) {
		let err = {
			missing: [],
			invalid: []
		};
		let res = {};
		for (let prop in model) {
			let value = req.body.hasOwnProperty(prop) ? req.body[prop] : null;

			// required
			if (model[prop].indexOf('required') > -1) {
				if (!value) {
					err.missing.push(prop);
					continue;
				}
			}

			// not required
			if (!value) {
				continue;
			}

			// isString
			if (model[prop].indexOf('string') > -1) {
				if (typeof value !== 'string') {
					err.invalid.push(prop + ' must be a string.');
				}
			}

			// isObject
			if (model[prop].indexOf('object') > -1) {
				if (typeof value !== 'object') {
					err.invalid.push(prop + ' must be an object.');
				}
			}

			// if sanitary add value
			res[prop] = value
		}
		err = formatError(err);
		callback(err, res);
	}
}

/**
 * Format Error
 *
 * Takes the generated error object and converts it to a human
 * readable string.
 */
function formatError(err) {

	if (err.missing.length === 0 && err.invalid.length === 0) {
		return null;
	}

	let error = '';
	if (err.missing.length > 0) {
		if (err.missing.length > 1) {
			error += 'Missing properties: ';
		} else {
			error += 'Missing property ';
		}
		error += err.missing.join(', ') + '. ';
	}

	if (err.invalid.length > 0) {
		error += err.invalid.join(' ');
	}

	error = new Error(error);
	error.http_code = 400;
	return error;
}