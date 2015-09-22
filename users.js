import scitran  from './libs/scitran';
import sanitize from './libs/sanitize';

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
	create(req, res, next) {
		
		let newUserModel = {
			_id:       'string, required',
			firstname: 'string, required',
			lastname:  'string, required'
		}

		sanitize.req(req, newUserModel, (err, user) => {
			if (err) {
				err = new Error(err);
				err.http_code = 400;
				next(err);
				return
			} else {
				scitran.createUser(user, (err, resp) => {
					if (!err) {res.send(resp);}
				});
			}
		});
				
	}
}