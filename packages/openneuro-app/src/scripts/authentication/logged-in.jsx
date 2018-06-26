import { withCookies } from 'react-cookie'

/**
 * Render children if logged in
 */
const LoggedIn = ({ cookies, children }) =>
  cookies.get('accessToken') ? children : null

export default withCookies(LoggedIn)
