import config  from '../config';
import cron    from 'cron';
import mongo   from './mongo';
import email   from './email';
import scitran from './scitran';
import moment  from 'moment';
import url     from 'url';

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
		c.notifications.updateOne({_id: notification._id}, notification, {upsert: true}, callback);
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
                _id: job.snapshotId + '_' + job.appId + '_' + job.agave.created,
                type: 'email',
                email: {
                    to: job.userId,
                    subject: 'Analysis - ' + job.appLabel + ' on ' + job.datasetLabel + ' - ' + job.agave.status,
                    template: 'job-complete',
                    data: {
                        firstName:       user.firstname,
                        lastName:        user.lastname,
                        appName:         job.appLabel,
                        appId:           job.appId,
                        jobId,           job.jobId,
                        startDate:       moment(job.agave.created).format('MMMM Do'),
                        datasetName:     job.datasetLabel,
                        status:          job.agave.status,
                        siteUrl:         url.parse(config.url).protocol + '//' + url.parse(config.url).hostname,
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

new cron.CronJob('0 */1 * * * *', () => {
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