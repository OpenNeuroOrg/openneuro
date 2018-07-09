import Cookies from 'universal-cookie'

const signOut = () => {
  const cookies = new Cookies()
  // Delete the token will reset client login state
  cookies.remove('accessToken')
}

export default signOut
