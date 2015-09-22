import scitran from './libs/scitran';

/**
 * Users
 *
 * Handlers for user actions.
 */
export default {

	/**
	 * Create User
	 *
	 * Takes a gmail address as an '_id' and a first and last name and
	 * creates a scitran user.
	 */
	create(req, res) {
		let _id       = req.body.hasOwnProperty('_id')       ? req.body._id       : null;
		let firstname = req.body.hasOwnProperty('firstname') ? req.body.firstname : null;
		let lastname  = req.body.hasOwnProperty('lastname')  ? req.body.lastname  : null;

		scitran.createUser({_id, firstname, lastname}, (err, resp) => {
			if (!err) {res.send(resp);}
		});
	}
}