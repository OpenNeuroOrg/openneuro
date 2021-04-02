import { useCookies } from 'react-cookie'
import { getProfile } from './profile.js'

export const isAdmin = () => {
  const profile = getProfile()
  return profile && profile.admin
}

/**
 * Render children if this is an admin user
 */
const AdminUser = ({ children }) => {
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  if (profile.admin) {
    return children
  } else {
    return null
  }
}

export default AdminUser
