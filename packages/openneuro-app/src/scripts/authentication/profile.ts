import jwtDecode from "jwt-decode"

interface OpenNeuroTokenProfile {
  sub: string
  email: string
  provider: string
  name: string
  admin: boolean
  iat: number
  exp: number
}

/**
 * Read JSON object from JWT string
 * @param {string} token
 */
export const parseJwt = jwtDecode

/**
 * Retrieve the user profile from JWT cookie
 */
export function getProfile(cookies): OpenNeuroTokenProfile {
  const accessToken = cookies["accessToken"]
  return accessToken ? parseJwt(accessToken) : null
}

/**
 * Return profile if token is not expired.
 * @param {*} cookies
 */
export const getUnexpiredProfile = (cookies) => {
  const profile = getProfile(cookies)
  if (guardExpired(profile)) return profile
}

/**
 * Test for an expired token
 * @param {object} profile A profile returned by getProfile()
 * @returns {boolean} False if expired
 */
export const guardExpired = (profile: OpenNeuroTokenProfile): boolean => {
  const now = new Date().getTime() / 1000
  if (profile && now < profile.exp) {
    return true
  } else {
    return false
  }
}

/**
 * Returns true if active user has at least one of the permissions in expectedLevels
 * @param {string[]} expectedLevels
 */
const hasDatasetPermissions = (expectedLevels) => (permissions, userId) => {
  if (userId) {
    const permission = permissions.userPermissions.find(
      (perm) => perm.user.id === userId,
    )
    return (permission && expectedLevels.includes(permission.level)) || false
  }
  return false
}

// Return true if the active user has write permission
export const hasEditPermissions = hasDatasetPermissions(["admin", "rw"])

//
export const hasDatasetAdminPermissions = hasDatasetPermissions(["admin"])
