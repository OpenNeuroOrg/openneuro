import cron  from 'cron';
import mongo from './mongo';
import email from './email';

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
	}

};

// notifications cron -------------------------------------

new cron.CronJob('*/30 * * * * *', () => {
	console.log('cron heart beat');
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