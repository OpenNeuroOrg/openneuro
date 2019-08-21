import config from '../../../config'

const { api: apiUrl, key } = config.support || { api: '', key: '' }
// placeholder password - freshdesk doesn't require a password with api key
const pass = 'x'

export default {
  /**
   * posts new ticket to freshdesk
   * body should at least include { name, email, subject, description }
   */
  postTicket: body => {
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${key}:${pass}`)}`,
      },
      body: JSON.stringify({
        ...body,
        status: 2,
        priority: 1,
      }),
    })
  },
}
