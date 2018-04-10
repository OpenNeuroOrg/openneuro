import nodemailer from 'nodemailer'
import config from '../../config'
import templates from './templates'
import juice from 'juice'

// library configuration ---------------------------------------

// setup email transporter
var transporter = nodemailer.createTransport({
  service: config.notifications.email.service,
  auth: {
    user: config.notifications.email.user + '@' + config.notifications.email.url,
    pass: config.notifications.email.pass,
  },
})

// public api --------------------------------------------------

export default {
  /**
     * Send
     *
     * Takes an email address, a subject, a template name
     * and a data object and immediately sends an email.
     */
  send(email, callback) {
    // template data
    let html = templates[email.template](email.data)

    // inline styles
    html = juice(html)

    // determine if the main is from a specific sender
    // or the generic email address
    let user = (email && email.from) ? email.from : config.notifications.email.user
    let from = user + '@' + config.notifications.email.url
    
    // configure mail options
    var mailOptions = {
      from: '"OpenNeuro" <notifications@openneuro.org>',
      // sender: from2,
      replyTo: from,
      to: email.to,
      subject: email.subject,
      html: html,
    }

    // send email
    transporter.sendMail(mailOptions, callback)
  },
}
