import { loginCheck } from './loginCheck.js'

/**
 * Render children if logged out
 */
const LoggedOut = ({ children }) => (loginCheck() ? null : children)

export default LoggedOut
