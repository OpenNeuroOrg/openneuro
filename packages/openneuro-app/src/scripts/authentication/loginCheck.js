import { getProfile, guardExpired } from "./profile"

// Expects a universal cookie
export const loginCheck = (cookies) => guardExpired(getProfile(cookies))
