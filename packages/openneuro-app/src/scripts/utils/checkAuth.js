import async from 'async'
import UserStore from '../user/user.store.js'

/**
 * Authentication Request Queuing
 *
 * Before any request we verify the status of the OAuth token.
 * To avoid multiple signin dialogues in the event the token
 * is expired all auth checking is queued to be performed
 * synchronously. The 'checkAuth' method is the primary method
 * to start the token check process.
 */
const authQueue = async.queue((authReq, callback) => {
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
}, 1)

const checkAuth = (successFunc, errorFunc) => {
  // Wrap the queue behavior in a promise
  return new Promise((resolve, reject) => {
    const successCallback = (...args) => {
      resolve(successFunc(...args))
    }
    const errorCallback = (...args) => {
      reject(errorFunc(...args))
    }
    let authReq = { successCallback, errorCallback }
    authQueue.push(authReq)
  })
}

export { authQueue, checkAuth }
export default checkAuth
