import { getProfile, guardExpired } from './profile.js'

// Expects a universal cookie
export const loginCheck = () => guardExpired(getProfile())
