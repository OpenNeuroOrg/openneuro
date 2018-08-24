import Cookies from 'universal-cookie'
import jwtDecode from 'jwt-decode'

/**
 * Read JSON object from JWT string
 * @param {string} token
 */
export const parseJwt = jwtDecode

/**
 * Retrieve the user profile from JWT cookie
 */
export const getProfile = () => {
  const cookies = new Cookies()
  const accessToken = cookies.get('accessToken')
  return accessToken ? parseJwt(accessToken) : null
}
