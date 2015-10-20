// dependencies --------------------------------------------------

import {MongoClient} from 'mongodb';
import config        from '../config';

export default {

	/**
	 * DB
	 *
	 * A storage location for a the database instance.
	 * Used to access the native mongo api.
	 */
	db: null,

	/**
	 * Connect
	 *
	 * Makes a connection to mongodb and creates an accessible
	 * reference to the db
	 */
	connect() {
		MongoClient.connect(config.mongo.url, (err, db) => {
			if (err) {
				console.log(err);
			}
			this.db = db;
			console.log('db connected');
		});
	}
}