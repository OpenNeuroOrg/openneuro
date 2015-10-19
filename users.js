// dependencies ------------------------------------------------------------

import scitran  from './libs/scitran';
import sanitize from './libs/sanitize';
import mongo    from './libs/mongo';


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
		sanitize.req(req, models.newUser, (err, user) => {
			if (err) {return next(err);}
			scitran.createUser(user, (err, resp) => {
				if (!err) {res.send(resp);}
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

			// check if request is made by a scitran super user

			// write user to db
			blacklist.insertOne(user, {w:1}, (err, item) => {
				if (err) {return next(err);}
				res.send(item);
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
		scitran.isSuperUser(req.headers.authorization);
		let blacklist = mongo.db.collection('blacklist');

		// check if request is make by a scitran super user

		// return blacklist
		blacklist.find().toArray((err, docs) => {
			if (err) {return next(err);}
			res.send(docs);
		});
	}

}