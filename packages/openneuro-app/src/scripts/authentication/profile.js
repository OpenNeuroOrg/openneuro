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

/**
 * Returns true if active user has at least one of the permissions in expectedLevels
 * @param {string[]} expectedLevels
 */
const hasDatasetPermissions = expectedLevels => (permissions, userId) => {
  if (userId) {
    const permission = permissions.userPermissions.find(
      perm => perm.user.id === userId,
    )
    return (permission && expectedLevels.includes(permission.level)) || false
  }
  return false
}

// Return true if the active user has write permission
export const hasEditPermissions = hasDatasetPermissions(['admin', 'rw'])

//
export const hasDatasetAdminPermissions = hasDatasetPermissions(['admin'])
