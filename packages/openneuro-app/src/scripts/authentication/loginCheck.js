import { getProfile, guardExpired } from './profile.js'

// Expects a universal cookie
export const loginCheck = (cookies) => guardExpired(getProfile(cookies))
