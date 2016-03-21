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
	 * Collections
	 *
	 * A list of all mongo collections and a simplified
	 * interface for accessing them. Collections start
	 * out null an are initialized after mongo connects.
	 */
	collections: {
		blacklist: null,
		validationQueue: null,
		jobs: null,
		tickets: null,
		userPreferences: null
	},

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
				process.exit();
			} else {
				this.db = db;
				for (let collectionName in this.collections) {
					this.collections[collectionName] = this.db.collection(collectionName);
				}
				console.log('db connected');
			}
		});
	}
}