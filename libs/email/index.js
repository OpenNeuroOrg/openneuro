import nodemailer from 'nodemailer';
import config     from '../../config';
import templates  from './templates';
import _          from 'underscore';

export default {

	send(receiver, subject, tpl, data) {

		_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g
		};

		var template = _.template(templates[tpl]);

		// setup transporter
		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: config.email.user,
				pass: config.email.pass
			}
		});

		// configure mail options
		var mailOptions = {
			from: config.email.user,
			to: receiver,
			subject: subject,
			html: template(data)
		};

		// send email
		transporter.sendMail(mailOptions, (err, info) => {
			console.log(err);
			console.log(info);
		});

	}

};