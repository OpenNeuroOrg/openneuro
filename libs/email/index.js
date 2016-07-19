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
	send(receiver, subject, tpl, data) {

		// configure mail options
		var mailOptions = {
			from: config.email.user,
			to: receiver,
			subject: subject,
			html: templates[tpl](data)
		};

		// send email
		transporter.sendMail(mailOptions, (err, info) => {
			console.log(err);
			console.log(info);
		});

	}

};