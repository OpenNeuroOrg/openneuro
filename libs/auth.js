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
				req.user = resp.body._id;
				req.isSuperUser = resp.body.root;
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
			if (err || !resp.body.root) {
				res.status(403).send({error: 'You must have admin privileges.'});
			} else {
				req.user = resp.body._id;
				req.isSuperUser = resp.body.root;
				return next();
			}
		});
	},

	/**
	 * Optional
	 *
	 * If a request has a valid access token it will
	 * append the user id to the req object. Will
	 * not throw an error. Used for requests that may
	 * work with varying levels of access.
	 */
	 optional(req, res, next) {
	 	scitran.getUser(req.headers.authorization, (err, resp) => {
			if (resp.body && resp.body._id) {
				req.user = resp.body._id;
				req.isSuperUser = resp.body.root;
			}
			return next();
		});
	 }

}
