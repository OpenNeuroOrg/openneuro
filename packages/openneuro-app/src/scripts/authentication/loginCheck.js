import {
  getProfile,
  guardExpired,
} from '../refactor_2021/authentication/profile.js'

// Expects a universal cookie
export const loginCheck = cookies => guardExpired(getProfile(cookies))
