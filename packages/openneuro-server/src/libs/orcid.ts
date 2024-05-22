// Camel case rule is disabled since ORCID API uses snake case variables
import request from "request"
import xmldoc from "xmldoc"
import config from "../config"

export default {
  getProfile(token) {
    return new Promise((resolve, reject) => {
      const data = token.split(":")
      if (data.length != 2) {
        reject("Invalid token")
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
            return reject({
              message:
                "An unexpected ORCID login failure occurred, please try again later.",
            })
          }
          let doc
          // Catch issues with parsing this response
          try {
            doc = new xmldoc.XmlDocument(res.body)
          } catch (err) {
            return reject({
              type: "config",
              message:
                "ORCID auth response invalid, most likely this is a misconfigured ORCID_API_ENDPOINT value",
            })
          }
          let name = doc.valueWithPath(
            "person:person.person:name.personal-details:credit-name",
          )
          const firstname = doc.valueWithPath(
            "person:person.person:name.personal-details:given-names",
          )
          const lastname = doc.valueWithPath(
            "person:person.person:name.personal-details:family-name",
          )
          const email = doc.valueWithPath(
            "person:person.email:emails.email:email.email:email",
          )

          if (!name && firstname && lastname) {
            if (firstname && lastname) {
              name = `${firstname} ${lastname}`
            } else {
              name = lastname || firstname
            }
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
          grant_type: "refresh_token",
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
          grant_type: "authorization_code",
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
