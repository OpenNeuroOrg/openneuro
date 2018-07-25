import { getProfile } from './profile.js'

// Expects a universal cookie
export const loginCheck = () => {
  const profile = getProfile()
  const now = new Date().getTime() / 1000
  if (profile && now < profile.exp) {
    return true
  } else {
    return false
  }
}
