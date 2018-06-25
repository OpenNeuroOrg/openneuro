import request from 'request'
import xmldoc from 'xmldoc'
import Raven from 'raven'
import config from '../config'

export default {
  getProfile(token) {
    return new Promise((resolve, reject) => {
      let data = token.split(':')
      if (data.length != 2) {
        reject('Invalid token')
      }
      let orcid = data[0]
      let accessToken = data[1]

      request.get(
        `${config.auth.orcid.apiURI}/v2.0/${orcid}/record`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
        (err, res) => {
          if (err) {
            Raven.captureMessage('Unexpected ORCID failure', { err })
            reject(
              'An unexpected ORCID login failure occurred, please try again later.',
            )
          }
          let doc = new xmldoc.XmlDocument(res.body)
          let firstname = doc.valueWithPath(
            'person:person.person:name.personal-details:given-names',
          )
          let lastname = doc.valueWithPath(
            'person:person.person:name.personal-details:family-name',
          )
          let email = doc.valueWithPath(
            'person:person.email:emails.email:email.email:email',
          )

          if (!firstname) {
            reject(
              'Your ORCID account does not have a given name, or it is not public. Please fix your account before continuing.',
            )
          }

          if (!lastname) {
            reject(
              'Your ORCID account does not have a family name, or it is not public. Please fix your account before continuing.',
            )
          }

          if (!email) {
            reject(
              'Your ORCID account does not have an e-mail, or your e-mail is not public. Please fix your account before continuing.',
            )
          }

          resolve({
            firstname,
            lastname,
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
          this.getProfile(res.body.access_token, err => {
            if (err) {
              callback(err)
            } else {
              callback(err, res.body)
            }
          })
        } else {
          callback(err, res.body)
        }
      },
    )
  },
}
