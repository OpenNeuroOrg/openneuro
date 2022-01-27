import nodemailer from 'nodemailer'
import mailjetTransport from 'nodemailer-mailjet-transport'
import config from '../../config'

// setup email transporter
const transporter = nodemailer.createTransport(
  mailjetTransport({
    auth: {
      apiKey: config.notifications.email.apiKey,
      secret: config.notifications.email.secret,
    },
  }),
)

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
