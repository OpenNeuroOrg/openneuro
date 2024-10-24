import config from "../../config"
import mailjet from "node-mailjet"

let transport
let perform_api_call = true
try {
  transport = mailjet.connect(
    config.notifications.email.apiKey,
    config.notifications.email.secret,
  )
} catch (_err) {
  perform_api_call = false
}

export const mailjetFormat = (email: Record<string, string>) => ({
  Messages: [
    {
      From: {
        Email: config.notifications.email.from,
        Name: "OpenNeuro",
      },
      To: [
        {
          Email: email.to,
          Name: email.name,
        },
      ],
      Subject: email.subject,
      HTMLPart: email.html,
    },
  ],
})

/**
 * Send via Mailjet
 * @param email Nodemailer style email record
 */
export const send = (email: Record<string, string>): Promise<Response> => {
  if (perform_api_call) {
    return transport
      .post("send", { version: "v3.1", perform_api_call })
      .request(mailjetFormat(email))
  } else {
    // Mailjet is not configured, instead log emails
    /* eslint-disable no-console */
    console.dir(email)
  }
}
