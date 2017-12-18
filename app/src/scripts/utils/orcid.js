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
    let { orcid, access_token } = this.token

    if (!orcid || !access_token) {
      callback(true, {
        token: null,
        profile: null,
        isSignedIn: false,
      })
      return
    }

    crn.getORCIDProfile(access_token, (err, res) => {
      let { firstname, lastname, email } = res.body
      callback(err, {
        token: this.token,
        profile: { _id: orcid, firstname, lastname, email },
        isSignedIn: !err && orcid,
      })
    })
  },

  refresh(callback) {
    if (this.initialized) {
      let { refresh_token } = this.token
      crn.refreshORCIDToken(refresh_token, err => {
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
    // Start the third part oauth flow in a new window
    this.oauthWindow = window.open(
      config.auth.orcid.URI +
        '/oauth/authorize?client_id=' +
        config.auth.orcid.clientID +
        '&response_type=code&scope=/authenticate&redirect_uri=' +
        config.auth.orcid.redirectURI,
      'ORCID',
    )

    // Setup a timer to check for the redirect URI
    this.oauthTimer = window.setInterval(() => {
      try {
        if (
          this.oauthWindow.document &&
          this.oauthWindow.document.URL.indexOf(
            config.auth.orcid.redirectURI,
          ) !== -1
        ) {
          const url = this.oauthWindow.document.URL
          const code = url.toString().match(/code=([^&]+)/)[1]
          clearInterval(this.oauthTimer)
          crn.getORCIDToken(code, (err, res) => {
            if (err) {
              callback(err)
            } else {
              this.token = res.body
              this.getCurrentUser(callback)
            }
          })
        } else {
          // If not the redirect page - check if closed and unregister
          if (this.oauthWindow.closed) {
            clearInterval(this.oauthTimer)
            return callback(true)
          }
        }
      } catch (e) {
        // DOMException means the oauth window is inaccessible due to the origin
        if (!(e instanceof DOMException)) {
          // Any other errors should stop polling
          // TODO - could reset login state here in case of failures
          clearInterval(this.oauthTimer)
          console.log(e)
        }
      }
    }, 200)
  },

  signOut(callback) {
    callback()
  },
}

export default orcid
