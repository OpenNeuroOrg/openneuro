import config from '../../../config'
import LoadGoogleAPI from 'load-google-api'

let google = {
  authInstance: {},

  initialized: false,

  init(callback) {
    if (!config.auth.google.clientID) {
      /* eslint-disable no-console */
      console.error(
        'Missing Google clientID, check auth.google.clientID configuration',
      )
      return
    }
    const loader = new LoadGoogleAPI({
      clientId: config.auth.google.clientID,
      scope: ['openid', 'email'],
    })
    loader.loadGoogleAPI().then(() => {
      loader.init().then(() => {
        this.authInstance = window.gapi.auth2.getAuthInstance()
        this.initialized = true
        this.getCurrentUser(callback)
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
    this.authInstance
      .signIn({ prompt: 'select_account' })
      .then(() => {
        this.getCurrentUser(callback)
      })
      .catch(err => {
        callback(err)
      })
  },

  signOut(callback) {
    this.authInstance
      .signOut()
      .then(() => {
        callback()
      })
      .catch(err => {
        callback(err)
      })
  },

  getCurrentUser(callback) {
    let err = null

    // get user data
    let user = this.authInstance.currentUser.get()

    // token
    let token = null
    for (let key in user) {
      if (user[key] && user[key].hasOwnProperty('access_token')) {
        token = user[key]
      }
    }

    // profile
    let basicProfile = user.getBasicProfile()
    let profile = null
    if (basicProfile) {
      profile = {
        _id: basicProfile.getEmail(),
        email: basicProfile.getEmail(),
        firstname: basicProfile.getGivenName(),
        lastname: basicProfile.getFamilyName(),
      }
    }

    // is signed in
    let isSignedIn = user.isSignedIn()
    callback(err, { token, profile, isSignedIn })
  },
}

export default google
