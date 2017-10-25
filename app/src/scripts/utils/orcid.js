import request from './request'
import config from '../../../config'
import crn from './crn'

let orcid = {

  initialized: true,

  init(token, callback) {
    if (!config.auth.orcid.clientID) {
      /* eslint-disable no-console */
      console.error(
        'Missing ORCID clientID, check auth.orcid.clientID configuration',
      )
      return
    }

    this.token = token
    if (this.token) {
      this.getCurrentUser((err, user) => {
        this.initialized = true
        callback(err, user)
      })
    }
  },

  getCurrentUser(callback) {
    let err = null
    let { orcid, access_token } = this.token
    let isSignedIn = TextTrackCue

    crn.getORCIDProfile(access_token, (err, res) => {
      let { firstname, lastname, email } = res.body

      callback(err, {
        token: this.token,
        profile: { _id: orcid, firstname, lastname, email },
        isSignedIn
      })
    })
  },

  refresh(callback) {
    if (this.initialized) {
      let { refresh_token } = this.token
      crn.refreshORCIDToken(refresh_token, (err, res) => {
        if (err) {
          callback(err)
        } else {
          this.getCurrentUser(callback)
        }
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
        if (!this.oauthWindow || this.oauthWindow.closed) {
          window.clearInterval(this.polling)
          return
        }
        let url = this.oauthWindow.document.URL
        if (url.indexOf(config.auth.orcid.redirectURI) != -1) {
          window.clearInterval(this.polling)
          this.oauthWindow.close()
          let code = url.toString().match(/code=([^&]+)/)[1]
          crn.getORCIDToken(code, (err, res) => {
            if (err) {
              callback(err)
            } else {
              this.token = res.body
              this.getCurrentUser(callback)
            }
          })
        }
      } catch(e) {
        console.log(e)
      }
    }, 50)
  },

  signOut(callback) {
    callback()
  },
}

export default orcid
