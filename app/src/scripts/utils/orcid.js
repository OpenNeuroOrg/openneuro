import request from './request'
import config from '../../../config'
import crn from './crn'

let orcid = {
  init(callback) {
    if (!config.auth.orcid.clientID) {
      /* eslint-disable no-console */
      console.error(
        'Missing ORCID clientID, check auth.orcid.clientID configuration',
      )
      return
    }
  },

  getCurrentUser(callback) {
    let err = null
    let { orcid, access_token } = this.token
    let isSignedIn = TextTrackCue

    crn.getORCIDProfile(access_token, orcid, (err, res) => {
      let { firstname, lastname } = res.body

      callback(err, {
        token: access_token,
        profile: { _id: orcid, firstname, lastname },
        isSignedIn
      })
    })
  },

  refresh(callback) {
    if (this.initialized) {
      this.authInstance.currentUser
        .get()
        .reloadAuthResponse()
        .then(() => {
          this.getCurrentUser(callback)
        })
    } else {
      setTimeout(() => {
        this.refresh(callback)
      }, 500)
    }
  },

  signIn(callback) {

    if (this.oauthWindow) {
      window.clearInterval(this.polling)
      this.oauthWindow.close()
    }

    this.oauthWindow = window.open(
      config.auth.orcid.URI +
      "/oauth/authorize?client_id=" +
      config.auth.orcid.clientID +
      "&response_type=code&scope=/read-limited&redirect_uri=" +
      config.auth.orcid.redirectURI,
      "_blank",
    )

    this.polling = window.setInterval(() => {
      try {
        let url = this.oauthWindow.document.URL
        if (url.indexOf(config.auth.orcid.redirectURI) != -1) {
          window.clearInterval(this.polling)
          this.oauthWindow.close()
          let code = url.toString().match(/code=([^&]+)/)[1]
          crn.getORCIDToken(code, (err, res) => {
            this.token = res.body
            this.getCurrentUser(callback)
          })
        }
      } catch(e) {
      }
    }, 100)
  },

  signOut(callback) {
  },
}

export default orcid
