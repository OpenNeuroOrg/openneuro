/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies --------------------------------------------------

import {MongoClient} from 'mongodb';
import config        from '../config';
import async         from 'async';

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
            jobDefinitions: null,
            tickets: null,
            userPreferences: null,
            notifications: null,
            counters: null,
            logs: null
        },
        scitran: {
            projects: null,
            project_snapshots: null
        }
    },

    /**
     * Connect
     *
     * Makes a connection to mongodbs and creates an accessible
     * reference to the dbs and collections
     * takes optional callback (using callback to kick of server side job polling)
     */
    connect(callback) {
        async.each(Object.keys(this.dbs), (dbName, cb) => {
            MongoClient.connect(config.mongo.url + dbName, (err, db) => {
                if (err) {
                    console.log(err);
                    process.exit();
                } else {
                    this.dbs[dbName] = db;
                    for (let collectionName in this.collections[dbName]) {
                        if (this.collections[dbName][collectionName] === null) {
                            this.collections[dbName][collectionName] = this.dbs[dbName].collection(collectionName);
                        }
                    }
                    console.log(dbName, ' - db connected');
                }
                cb();
            });
        }, () => {
            if(callback && typeof callback === 'function') {
                callback();
            }
        });
    }
};