import { withCookies } from 'react-cookie'

/**
 * Render children if logged in
 */
const LoggedOut = ({ cookies, children }) =>
  cookies.get('accessToken') ? null : children

export default withCookies(LoggedOut)
