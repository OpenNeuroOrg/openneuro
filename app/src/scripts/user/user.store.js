// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import actions from './user.actions.js'
import google from '../utils/google'
import orcid from '../utils/orcid'
import crn from '../utils/crn'
import scitran from '../utils/scitran'
import async from 'async'
import notifications from '../notification/notification.actions'
import dashboardActions from '../dashboard/dashboard.datasets.actions'
import datasetActions from '../dataset/dataset.actions'
import upload from '../upload/upload.actions'

// store setup -----------------------------------------------------------------------

let UserStore = Reflux.createStore({
  listenables: actions,

  init() {
    this.setInitialState()

    this.providers = {
      google,
      orcid,
    }

    const initCallback = provider => (err, user) => {
      if (user.token) {
        this.update(
          {
            token: user.token,
            profile: user.profile,
            provider,
          },
          { persist: true },
        )
        crn.verifyUser((err, res) => {
          if (res.body.code === 403) {
            this.signOut()
          } else {
            this.update({ scitran: res.body }, { persist: true })
          }
        })
      }
    }

    google.init(initCallback('google'))
    orcid.init(this.data.token, initCallback('orcid'))
  },

  getInitialState() {
    return this.data
  },

  /**
     * Toggle Modal
    */
  toggle(value) {
    let newState = {}
    newState[value] = !this.data[value]
    this.update(newState)
  },

  // data ------------------------------------------------------------------------------

  data: {},

  update(data, options) {
    for (let prop in data) {
      this.data[prop] = data[prop]
      if (options && options.persist) {
        window.localStorage[prop] = JSON.stringify(data[prop])
      }
    }
    this.trigger(this.data)
  },

  /**
     * Set Initial State
     *
     * Sets the state to the data object defined
     * inside the function. Also takes a diffs object
     * which will set the state to the initial state
     * with any differences passed.
     */
  setInitialState(diffs) {
    let data = {
      token:
        window.localStorage.token && window.localStorage.token !== 'undefined'
          ? JSON.parse(window.localStorage.token)
          : null,
      profile: window.localStorage.profile
        ? JSON.parse(window.localStorage.profile)
        : null,
      provider: window.localStorage.provider
        ? JSON.parse(window.localStorage.provider)
        : null,
      scitran: window.localStorage.scitran
        ? JSON.parse(window.localStorage.scitran)
        : null,
      loading: false,
      signinError: '',
      showUploadModal: false,
      supportModal: false,
      loginModal: false,
      infoPanel: false,
    }
    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // Auth Actions ----------------------------------------------------------------------

  signIn(options) {
    let transition = options.hasOwnProperty('transition')
      ? options.transition
      : true

    this.update(
      {
        loading: true,
      },
      { persist: true },
    )

    this.providers[options.provider].signIn((err, user) => {
      if (err) {
        let message = 'We could not sign you in. Please try again later.'
        if (err.response && err.response.body) {
          message = err.response.body.error || message
        }

        if (!transition) {
          notifications.createAlert({ type: 'Error', message: message })
        } else {
          this.update({
            loading: false,
            signinError: message,
          })
        }
        return
      }

      this.update(
        {
          token: user.token,
          profile: user.profile,
          provider: options.provider,
        },
        { persist: true },
      )

      crn.verifyUser((err, res) => {
        if (res.body.code === 403) {
          // Pass only the scitran required user values to createUser
          crn.createUser(user.profile, (err, res) => {
            if (res.body.status === 403) {
              this.clearAuth()
              let message = (
                <span>
                  This user account has been blocked. If you believe this is by
                  mistake please contact the{' '}
                  <a
                    href="mailto:openfmri@gmail.com?subject=Center%20for%20Reproducible%20Neuroscience%20Blocked%20User"
                    target="_blank">
                    site adminstrator
                  </a>.
                </span>
              )
              if (!transition) {
                notifications.createAlert({ type: 'Error', message: message })
              } else {
                this.update({
                  loading: false,
                  signinError: message,
                })
              }
              return
            }
            crn.verifyUser((err, res) => {
              this.handleSignIn(transition, res.body, user.profile)
            })
          })
        } else if (!res.body._id) {
          this.clearAuth()
          let message =
            'We are currently experiencing issues. Please try again later.'
          if (!transition) {
            notifications.createAlert({ type: 'Error', message: message })
          } else {
            this.update({
              loading: false,
              signinError: message,
            })
          }
        } else {
          this.handleSignIn(transition, res.body, user.profile)
        }
      })
    })
  },

  /**
     * Signin
     *
     * Initiates the Google OAuth2 sign in flow. Creates a new
     * user if the user doesn't already exist.
     */
  googleSignIn(options) {
    if (!google.initialized) {
      return
    }
    options.provider = 'google'
    this.update({ loginModal: false })
    this.signIn(options)
  },

  /**
     * Signin
     *
     * Initiates the ORCID OAuth2 sign in flow. Creates a new
     * user if the user doesn't already exist.
     */
  orcidSignIn(options) {
    options.provider = 'orcid'
    this.update({ loginModal: false })
    this.signIn(options)
  },

  /**
     * Sign Out
     *
     * Signs the user out by destroying the current
     * OAuth2 session.
     */
  signOut(uploadStatus, history) {
    let signout = true
    if (uploadStatus === 'uploading') {
      signout = confirm(
        'You are currently uploading files. Signing out of this site will cancel the upload process. Are you sure you want to sign out?',
      )
    }
    if (signout) {
      this.providers[this.data.provider].signOut(() => {
        upload.setInitialState()
        this.clearAuth()
        history.push('/')
      })
      // Always reset the loginModal on logout
      this.update({ loginModal: false })
    }
  },

  /**
     * Clear Authentication
     *
     * Clears all user related data from memory and
     * browser storage.
     */
  clearAuth() {
    delete window.localStorage.token
    delete window.localStorage.provider
    delete window.localStorage.profile
    delete window.localStorage.scitran
    this.update(
      {
        token: null,
        provider: null,
        profile: null,
        scitran: null,
      },
      { persist: true },
    )
  },

  /**
     * Handle Sign In
     *
     * Handles necessary action after a signin has been completed.
     */
  handleSignIn(transition, scitran, profile) {
    if (!profile.imageUrl) {
      profile.imageUrl = scitran.avatar
    }
    this.update({ loading: false })
    this.update({ scitran, profile }, { persist: true })
    datasetActions.reloadDataset()
    dashboardActions.getDatasets(true)
  },

  /**
     * Refresh Token
     *
     * The google client library will automatically refresh
     * the token behind the scenes when it is within 5 minutes
     * of expiring. Refresh should be called during that time
     * or after expiration to reset the local data to match
     * the updated token.
     */
  refreshToken(callback) {
    const refreshCallback = (err, user) => {
      if (err) {
        this.signOut()
      } else {
        this.update(
          {
            token: user.token,
            profile: user.profile,
          },
          { persist: true },
        )
        callback(user.token ? user.token.access_token : null)
      }
    }

    switch (this.data.provider) {
      case 'orcid':
        orcid.refresh(refreshCallback)
        break

      default:
      case 'google':
        google.refresh(refreshCallback)
        break
    }
  },

  /**
     * Has Token
     *
     * Returns a boolean representing whether or not
     * the current session has an access token present
     * regardless of whether or not is is expired/valid.
     */
  hasToken() {
    if (
      !window.localStorage.token ||
      window.localStorage.token === 'undefined'
    ) {
      return false
    }
    let token = JSON.parse(window.localStorage.token)
    return token && token.hasOwnProperty('access_token') && token.access_token
  },

  // request queue -----------------------------------------------------------------

  /**
     * Authentication Request Queuing
     *
     * Before any request we verify the status of the OAuth token.
     * To avoid multiple signin dialogues in the event the token
     * is expired all auth checking is queued to be performed
     * synchronously. The 'checkAuth' method is the primary method
     * to start the token check process.
     */
  queue: async.queue((authReq, callback) => {
    let { token, provider } = UserStore.data
    let refreshWindow = 4 * 60 * 1000
    if (!token || Date.now() + refreshWindow >= token.expires_at) {
      // refresh the token
      UserStore.refreshToken(access_token => {
        authReq.successCallback(provider, access_token, UserStore.isRoot())
        callback()
      })
    } else {
      authReq.successCallback(provider, token.access_token, UserStore.isRoot())
      callback()
    }
  }, 1),

  checkAuth(successCallback, errorCallback) {
    let authReq = { successCallback, errorCallback }
    this.queue.push(authReq)
  },

  /**
     * Is Root
     *
     * Returns a boolean representing if the current user has
     * root permissions. Attempts to read in memory data and falls back
     * to checking local storage when necessary.
     */
  isRoot() {
    if (this.data.scitran && this.data.scitran.root) {
      return true
    }
    if (
      window.localStorage.scitran &&
      (JSON.parse(window.localStorage.scitran) || {}).root
    ) {
      return true
    } else {
      return false
    }
  },

  // Actions ---------------------------------------------------------------------------

  /**
     * Get Preferences
     *
     * Calls back with the current user's preferences.
     */
  getPreferences(callback) {
    callback(this.data.scitran.preferences)
  },

  /**
     * Update Preferences
     */
  updatePreferences(preferences, callback) {
    let scitranUser = this.data.scitran
    scitranUser.preferences = scitranUser.preferences
      ? scitranUser.preferences
      : {}
    for (let key in preferences) {
      scitranUser.preferences[key] = preferences[key]
    }
    scitran.updateUser(
      this.data.scitran._id,
      { preferences: preferences },
      (err, res) => {
        this.update({ scitran: scitranUser })
        if (callback) {
          callback(err, res)
        }
      },
    )
  },
})

export default UserStore
