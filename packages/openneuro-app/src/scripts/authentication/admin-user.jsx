import { getProfile } from './profile.js'

/**
 * Render children if this is an admin user
 */
const AdminUser = ({ children }) => {
  const profile = getProfile()
  return profile && profile.admin ? children : null
}
export default AdminUser
