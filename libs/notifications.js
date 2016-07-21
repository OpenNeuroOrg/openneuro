import config  from '../config';
import cron    from 'cron';
import mongo   from './mongo';
import email   from './email';
import scitran from './scitran';

let c = mongo.collections;

// public api ---------------------------------------------

let notifications = {

	/**
	 * Add
	 *
	 * Takes a notification object and
	 * adds it to the database to be processed by
	 * the cron.
	 */
	add (notification, callback) {
		c.notifications.insertOne(notification, callback);
	},

	/**
	 * Send
	 */
	send (notification, callback) {
		if (notification.type === 'email') {
			email.send(notification.email, callback);
		}
	},

	/**
	 * Job Complete
	 *
	 * Sends an email notification to the user
	 * with the status of their job.
	 */
	jobComplete (job) {
        scitran.getUser(job.userId, (err, res) => {
            let user = res.body;
            notifications.add({
                type: 'email',
                email: {
                    to: job.userId,
                    subject: 'Analysis - ' + job.appLabel + ' on ' + job.datasetLabel + ' - ' + job.agave.status,
                    template: 'job-complete',
                    data: {
                        firstName:       user.firstname,
                        lastName:        user.lastname,
                        appName:         job.appLabel,
                        startDate:       job.agave.created,
                        datasetName:     job.datasetLabel,
                        status:          job.agave.status,
                        siteUrl:         config.url,
                        datasetId:       job.datasetId,
                        snapshotId:      job.snapshotId,
                        unsubscribeLink: ''
                    }
                }
            }, (err, info) => {});
        });
	}

};

// notifications cron -------------------------------------

new cron.CronJob('*/30 * * * * *', () => {
	c.notifications.find({}).toArray((err, docs) => {
		for (let notification of docs) {
			notifications.send(notification, (err) => {
				if (!err) {
					c.notifications.removeOne({_id: notification._id}, {}, (err, doc) => {});
				}
			});
		}
	});
}, null, true, 'America/Los_Angeles');

export default notifications