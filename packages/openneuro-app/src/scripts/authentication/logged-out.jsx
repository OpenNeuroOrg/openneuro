import { useCookies } from "react-cookie"
import { loginCheck } from "./loginCheck.js"

/**
 * Render children if logged out
 */
const LoggedOut = ({ children }) => {
  const [cookies] = useCookies()
  return loginCheck(cookies) ? null : children
}

export default LoggedOut
