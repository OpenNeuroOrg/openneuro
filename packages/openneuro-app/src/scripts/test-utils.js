import cookies from './utils/cookies.js'

/**
 * Sets a login cookie during a test run
 */
export const testLogin = () => {
  cookies.set(
    'accessToken',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwicHJvdmlkZXIiOiJqZXN0IiwibmFtZSI6IlRlc3RlciIsImFkbWluIjp0cnVlLCJqdGkiOiIwNjc2M2JjMi02ZTkwLTRjNTMtOWNkNi01ODE2MGM0ZGM1YzMiLCJpYXQiOjE1NTQyMzc0NDAsImV4cCI6MTU1NDI0MTA0MH0._zfwOPqNZUT8DAUB_rIcIbcaKu7nzDs0OZjqaXfhymM',
  )
}

/**
 * Clear a login cookie during a test run
 */
export const testLogout = () => {
  cookies.set('accessToken', null)
}
