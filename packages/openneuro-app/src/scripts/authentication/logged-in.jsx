import { useCookies } from "react-cookie"
import { loginCheck } from "./loginCheck.js"

/**
 * Render children if logged in
 */
const LoggedIn = ({ children }) => {
  const [cookies] = useCookies()
  return loginCheck(cookies) ? children : null
}

export default LoggedIn
