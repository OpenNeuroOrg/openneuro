const getAuth = () => {
  try {
    return JSON.parse(localStorage.token).access_token
  } catch (_) {
    return null
  }
}

export default getAuth
