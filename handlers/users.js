// dependencies ------------------------------------------------------------

import scitran  from '../libs/scitran';
import sanitize from '../libs/sanitize';
import mongo    from '../libs/mongo';


// models ------------------------------------------------------------------

let models = {
	newUser: {
		_id:       'string, required',
		firstname: 'string, required',
		lastname:  'string, required'
	},
	blacklistUser: {
		_id:       'string, required',
		firstname: 'string',
		lastname:  'string',
		note:      'required'
	}
}

// handlers ----------------------------------------------------------------

/**
 * Users
 *
 * Handlers for user actions.
 */
export default {


	// create --------------------------------------------------------------

	/**
	 * Create User
	 *
	 * Takes a gmail address as an '_id' and a first and last name and
	 * creates a scitran user.
	 */
	create(req, res, next) {
		let blacklist = mongo.db.collection('blacklist');
		sanitize.req(req, models.newUser, (err, user) => {
			if (err) {return next(err);}
			blacklist.findOne({_id: user._id}).then((item) => {
				if (item) {
					let error = new Error("This user email has been blacklisted and cannot be given an account");
					error.http_code = 403;
					return next(error);
				} else {
					scitran.createUser(user, (err, resp) => {
						if (!err) {res.send(resp);}
					});
				}
			});
		});
	},

	/**
	 * Blacklist User
	 *
	 * Take a gmail address as an '_id' and optionally takes a first name,
	 * lastname and note and sets the user info as blacklisted.
	 */
	blacklist(req, res, next) {
		let blacklist = mongo.db.collection('blacklist');
		sanitize.req(req, models.blacklistUser, (err, user) => {
			if (err) {return next(err);}

			scitran.isSuperUser(req.headers.authorization, (isSuperUser) => {
				if (isSuperUser) {
					blacklist.findOne({_id: user._id}).then((item) => {
						if (item) {
							let error = new Error("A user with that _id has already been blacklisted");
							error.http_code = 409;
							return next(error);
						} else {
							blacklist.insertOne(user, {w:1}, (err, item) => {
								if (err) {return next(err);}
								res.send(user);
							});
						}
					});
				} else {
					let error = new Error("You must have admin privileges to blacklist a user");
					error.http_code = 403;
					return next(error);
				}
			});
		});
	},

	// read ----------------------------------------------------------------

	/**
	 * Get Blacklist
	 *
	 * Returns a list of blacklisted users.
	 */
	getBlacklist(req, res, next) {
		let blacklist = mongo.db.collection('blacklist');
		scitran.isSuperUser(req.headers.authorization, (isSuperUser) => {
			if (isSuperUser) {
				blacklist.find().toArray((err, docs) => {
					if (err) {return next(err);}
					res.send(docs);
				});
			} else {
				let error = new Error("You must have admin privileges to access the blacklist.");
				error.http_code = 403;
				return next(error);
			}
		});

	},

	// delete --------------------------------------------------------------

	/**
	 * UnBlacklist
	 *
	 * Takes a user id (email) as a url parameter
	 * and removes the user from the blacklist
	 * if they were blacklisted.
	 */
	unBlacklist(req, res, next) {
		let userId = req.params.id;

		let blacklist = mongo.db.collection('blacklist');
		scitran.isSuperUser(req.headers.authorization, (isSuperUser) => {
			if (isSuperUser) {
				blacklist.findAndRemove({_id: userId}, [], (err, doc) => {
					if (err) {return next(err);}
					if (!doc.value) {
						let error = new Error("A user with that id was not found");
						error.http_code = 404;
						return next(error);
					}
					res.send({message: "User " + userId + " has been un-blacklisted."});
				});
			} else {
				let error = new Error("You must have admin privileges to update the blacklist.");
				error.http_code = 403;
				return next(error);
			}
		});
	}

}