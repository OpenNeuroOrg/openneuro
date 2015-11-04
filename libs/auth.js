import scitran from './scitran';

/**
 * Authorization
 *
 * Authorization middleware.
 */
export default {

	/**
	 * User
	 *
	 * Checks if a request contains an access token
	 * for a valid user. Throws an error or calls next
	 * function.
	 */
	user(req, res, next) {
		scitran.getUser(req.headers.authorization, (err, resp) => {
			if (err || resp.body.code === 400 || resp.body.code === 401) {
				res.status(401).send({error: 'You must have a valid access token.'});
			} else {
				return next();
			}
		});
	},

	/**
	 * Super User
	 *
	 * Checks if a request contains an access token
	 * for a valid superuser. Throws an error or calls next
	 * function.
	 */
	superuser(req, res, next) {
		scitran.getUser(req.headers.authorization, (err, resp) => {
			if (err || !resp.body.wheel) {
				res.status(403).send({error: 'You must have admin privileges.'});
			} else {
				return next();
			}
		});
	}
}