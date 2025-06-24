// Camel case rule is disabled since ORCID API uses snake case variables
import xmldoc from "xmldoc"
import config from "../config"
import * as Sentry from "@sentry/node"

export default {
  async getProfile(orcid, accessToken) {
    try {
      const response = await fetch(
        `${config.auth.orcid.apiURI}/v2.0/${orcid}/record`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      const text = await response.text()
      const doc = new xmldoc.XmlDocument(text)
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

      return {
        name,
        email,
      }
    } catch (err) {
      Sentry.captureException(err, {
        extra: {
          orcid,
        },
      })
    }
  },

  async refreshToken(refreshToken, callback) {
    try {
      const form = new URLSearchParams({
        client_id: config.auth.orcid.clientID,
        client_secret: config.auth.orcid.clientSecret,
        redirect_uri: config.auth.orcid.redirectURI,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      })
      const res = await fetch(`${config.auth.orcid.URI}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: form,
      })
      const body = await res.json()
      if (!res.ok) {
        callback(
          new Error(body.error_description || `ORCID API error: ${res.status}`),
          body,
        )
      } else {
        const { orcid, access_token } = body
        body.access_token = `${orcid}:${access_token}`
        callback(null, body)
      }
    } catch (err) {
      Sentry.captureException(err)
      callback(err, null)
    }
  },

  async validateToken(code, callback) {
    try {
      const form = new URLSearchParams({
        client_id: config.auth.orcid.clientID,
        client_secret: config.auth.orcid.clientSecret,
        redirect_uri: config.auth.orcid.redirectURI,
        grant_type: "authorization_code",
        code,
      })
      const res = await fetch(`${config.auth.orcid.URI}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: form,
      })
      const body = await res.json()
      if (!res.ok) {
        callback(
          new Error(body.error_description || `ORCID API error: ${res.status}`),
          body,
        )
      } else {
        const { orcid, access_token } = body
        body.access_token = `${orcid}:${access_token}`
        callback(null, body)
      }
    } catch (err) {
      Sentry.captureException(err)
      callback(err, null)
    }
  },
}
