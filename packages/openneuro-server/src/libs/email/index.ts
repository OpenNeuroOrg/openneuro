import nodemailer from 'nodemailer'

import config from '../../config'

// setup email transporter
let transporter
try {
  const mailjetTransport = require('nodemailer-mailjet-transport')
  transporter = nodemailer.createTransport(
    mailjetTransport({
      auth: {
        apiKey: config.notifications.email.apiKey,
        apiSecret: config.notifications.email.secret,
      },
    }),
  )
} catch (err) {
  // Mailjet is not configured, instead log emails
  transporter = {
    sendMail: (mail, cb) => {
      console.dir(mail)
    },
  }
}

export const send = (
  email: Record<string, string>,
  callback: (err, response) => void,
): void => {
  // configure mail options
  const mailOptions = {
    from: `"OpenNeuro" <${config.notifications.email.from}>`,
    replyTo: config.notifications.email.from,
    to: email.to,
    subject: email.subject,
    html: email.html,
  }

  // send email
  transporter.sendMail(mailOptions, callback)
}
