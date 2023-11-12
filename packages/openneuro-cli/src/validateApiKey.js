import jwtDecode, { InvalidTokenError } from "jwt-decode"

export const validateApiKey = (key) => {
  try {
    jwtDecode(key)
    return true
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      return "API key format is invalid, please make sure you've copied the correct key and try again."
    } else {
      throw err
    }
  }
}
