import Cookies from 'universal-cookie'

/**
 * Read JSON object from JWT string
 * @param {string} token
 */
export const parseJwt = token => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(global.atob(base64))
}

/**
 * Retrieve the user profile from JWT cookie
 */
export const getProfile = () => {
  const cookies = new Cookies()
  const accessToken = cookies.get('accessToken')
  return accessToken ? parseJwt(accessToken) : null
}
