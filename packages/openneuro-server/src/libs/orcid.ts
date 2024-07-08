// Camel case rule is disabled since ORCID API uses snake case variables
import request from 'request'
import xmldoc from 'xmldoc'
import config from '../config'

export default {
  getProfile(token) {
    return new Promise((resolve, reject) => {
      const data = token.split(':')
      if (data.length != 2) {
        reject('Invalid token')
      }
      const orcid = data[0]
      const accessToken = data[1]

      request.get(
        `${config.auth.orcid.apiURI}/v2.0/${orcid}/record`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
        (err, res) => {
          if (err) {
            reject({
              message:
                'An unexpected ORCID login failure occurred, please try again later.',
            })
          }
          const doc = new xmldoc.XmlDocument(res.body)
          let name = doc.valueWithPath(
            'person:person.person:name.personal-details:credit-name',
          )
          const firstname = doc.valueWithPath(
            'person:person.person:name.personal-details:given-names',
          )
          const lastname = doc.valueWithPath(
            'person:person.person:name.personal-details:family-name',
          )
          const email = doc.valueWithPath(
            'person:person.email:emails.email:email.email:email',
          )

          if (!name) {
            if (!firstname) {
              reject({
                type: 'given',
                message:
                  'Your ORCID account does not have a given name, or it is not shared with trusted institutions. Please add a name to your ORCID profile and make it available to trusted institutions or public.',
              })
            } else if (!lastname) {
              reject({
                type: 'family',
                message:
                  'Your ORCID account does not have a family name, or it not shared with trusted institutions. Please add a name to your ORCID profile and make it available to trusted institutions or public.',
              })
            } else {
              name = `${firstname} ${lastname}`
            }
          }

          if (!email) {
            reject({
              type: 'email',
              message:
                'Your ORCID profile does not include an email shared with trusted institutions. Please verify your ORCID profile email and share it with trusted institutions, OpenNeuro will use this email for important notices related to any datasets you upload.',
            })
          }

          resolve({
            name,
            email,
          })
        },
      )
    })
  },

  refreshToken(refreshToken, callback) {
    request.post(
      `${config.auth.orcid.URI}/oauth/token`,
      {
        form: {
          client_id: config.auth.orcid.clientID,
          client_secret: config.auth.orcid.clientSecret,
          redirect_uri: config.auth.orcid.redirectURI,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        json: true,
      },
      (err, res) => {
        if (!err) {
          const { orcid, access_token } = res.body
          res.body.access_token = `${orcid}:${access_token}`
        }
        callback(err, res.body)
      },
    )
  },

  validateToken(code, callback) {
    request.post(
      `${config.auth.orcid.URI}/oauth/token`,
      {
        form: {
          client_id: config.auth.orcid.clientID,
          client_secret: config.auth.orcid.clientSecret,
          redirect_uri: config.auth.orcid.redirectURI,
          grant_type: 'authorization_code',
          code,
        },
        json: true,
      },
      (err, res) => {
        if (!err) {
          const { orcid, access_token } = res.body
          res.body.access_token = `${orcid}:${access_token}`

          // Check if user has email
          this.getProfile(res.body.access_token)
        } else {
          callback(err, res.body)
        }
      },
    )
  },
}
