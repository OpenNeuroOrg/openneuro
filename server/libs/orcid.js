import request from 'request'
import xmldoc from 'xmldoc'
import config from '../config'

export default {

  getProfile(accessToken, orcid, callback) {
    request.get(
      `https://api.sandbox.orcid.org/v2.0/${orcid}/record`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      },
      (err, res) => {
        let doc = new xmldoc.XmlDocument(res.body)
        let firstname = doc.valueWithPath('person:person.person:name.personal-details:given-names')
        let lastname = doc.valueWithPath('person:person.person:name.personal-details:family-name')

        callback(err, {
          firstname,
          lastname,
        })
      }
    )
  },

  validateToken(code, callback) {
    request.post(
      "https://sandbox.orcid.org/oauth/token",
      {
        form: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:8111/users/signin/orcid',
        },
        json: true,
      },
      (err, res) => {
        callback(err, res.body)
      }
    )
  },

}