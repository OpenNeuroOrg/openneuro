import cookies from "../utils/cookies.js"

const signOut = () => {
  // Delete the token will reset client login state
  cookies.remove("accessToken", { path: "/" })
}

export default signOut
