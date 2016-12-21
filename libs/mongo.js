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
	dbs: {
		crn:     null,
		scitran: null
	},

	/**
	 * Collections
	 *
	 * A list of all mongo collections and a simplified
	 * interface for accessing them. Collections start
	 * out null an are initialized after mongo connects.
	 */
	collections: {
		crn: {
			blacklist: null,
			validationQueue: null,
			jobs: null,
			tickets: null,
			userPreferences: null,
			notifications: null
		},
		scitran: {
			projects: null,
			project_snapshots: null
		}
	},

	/**
	 * Connect
	 *
	 * Makes a connection to mongodba and creates an accessible
	 * reference to the dbs and collections
	 */
	connect() {
		// connect crn
		MongoClient.connect(config.mongo.url + 'crn', (err, db) => {
			if (err) {
				console.log(err);
				process.exit();
			} else {
				this.dbs.crn = db;
				for (let collectionName in this.collections.crn) {
					if (this.collections.crn[collectionName] === null) {
						this.collections.crn[collectionName] = this.dbs.crn.collection(collectionName);
					}
				}

				console.log('db connected');
			}
		});

		// connect scitran
		MongoClient.connect(config.mongo.url + 'scitran', (err, db) => {
			if (err) {
				console.log(err);
				process.exit();
			} else {
				this.dbs.scitran = db;
				console.log('scitran db connected');
				this.collections.scitran = {
					projects: this.dbs.scitran.collection('projects'),
					projectSnapshots: this.dbs.scitran.collection('project_snapshots')
				};
			}
		});
	}
}