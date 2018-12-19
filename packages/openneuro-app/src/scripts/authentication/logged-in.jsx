import { loginCheck } from './loginCheck.js'

/**
 * Render children if logged in
 */
const LoggedIn = ({ children }) => (loginCheck() ? children : null)

export default LoggedIn
