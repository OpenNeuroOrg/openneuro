import nodemailer from 'nodemailer'
import config from '../../config'

// setup email transporter
const transporter = nodemailer.createTransport({
  service: config.notifications.email.service,
  auth: {
    user:
      config.notifications.email.user + '@' + config.notifications.email.url,
    pass: config.notifications.email.pass,
  },
})

export const send = (
  email: Record<string, string>,
  callback: (err, response) => void,
): void => {
  // inline styles
  //html = juice(html)

  // determine if the main is from a specific sender
  // or the generic email address
  const user: string =
    email && email.from ? email.from : config.notifications.email.user
  const from = user + '@' + config.notifications.email.url

  // configure mail options
  const mailOptions = {
    from: '"OpenNeuro" <notifications@openneuro.org>',
    replyTo: from,
    to: email.to,
    subject: email.subject,
    html: email.html,
  }

  // send email
  transporter.sendMail(mailOptions, callback)
}
