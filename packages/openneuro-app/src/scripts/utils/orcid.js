import config from '../../../config'
import crn from './crn'

const orcid = {
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { orcid, access_token } = this.token

    // eslint-disable-next-line @typescript-eslint/camelcase
    if (!orcid || !access_token) {
      callback(true, {
        token: null,
        profile: null,
        isSignedIn: false,
      })
      return
    }

    crn
      .getORCIDProfile(access_token)
      .then(res => {
        const { firstname, lastname, email } = res.body
        const name = firstname + ' ' + lastname
        callback(null, {
          token: this.token,
          profile: { _id: orcid, name, email },
          isSignedIn: orcid,
        })
      })
      .catch(err => {
        callback(err)
      })
  },

  refresh(callback) {
    if (this.initialized) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { refresh_token } = this.token

      crn
        .refreshORCIDToken(refresh_token)
        .then(() => {
          this.getCurrentUser(callback)
        })
        .catch(err => {
          callback(err)
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
          crn
            .getORCIDToken(code)
            .then(res => {
              this.token = res.body
              this.getCurrentUser(callback)
            })
            .catch(err => {
              callback(err)
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
