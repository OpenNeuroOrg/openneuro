import nodemailer from 'nodemailer';
import config     from '../../config';
import templates  from './templates';

// library configuration ---------------------------------------

// setup email transporter
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: config.email.user,
		pass: config.email.pass
	}
});

// public api --------------------------------------------------

export default {

	/**
	 * Send
	 *
	 * Takes an email address, a subject, a template name
	 * and a data object and immediately sends an email.
	 */
	send (email, callback) {

		// configure mail options
		var mailOptions = {
			from: config.email.user,
			to: email.to,
			subject: email.subject,
			html: templates[email.template](email.data)
		};

		// send email
		transporter.sendMail(mailOptions, callback);

	}

};