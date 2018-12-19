import jwtDecode from 'jwt-decode'
import cookies from '../utils/cookies.js'

/**
 * Read JSON object from JWT string
 * @param {string} token
 */
export const parseJwt = jwtDecode

/**
 * Retrieve the user profile from JWT cookie
 */
export const getProfile = () => {
  const accessToken = cookies.get('accessToken')
  return accessToken ? parseJwt(accessToken) : null
}
