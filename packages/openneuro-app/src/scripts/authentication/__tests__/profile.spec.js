import { parseJwt } from '../profile.js'

const asciiToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const utf8Token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Iuelnue1jOenkeWtpuiAhSIsImlhdCI6MTUxNjIzOTAyMn0.pUw2ARoXv4LkJXB1ZR3Th6xG83URT6mn1TftC7ac_O8'

describe('authentication/profile', () => {
  it('decodes a JWT to Javascript object', () => {
    expect(parseJwt(asciiToken)).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    })
  })
  it('decodes a JWT with Unicode strings', () => {
    expect(parseJwt(utf8Token)).toEqual({
      sub: '1234567890',
      name: '神経科学者',
      iat: 1516239022,
    })
  })
})
