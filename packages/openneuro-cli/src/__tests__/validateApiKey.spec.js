import { validateApiKey } from '../validateApiKey'

describe('validateApiKey()', () => {
  it('succeeds silently with valid API key', () => {
    expect(
      validateApiKey(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNmY2YWZlOC02MWZhLTRjYmUtOWNkYi1hMzkyN2U3MGJlMjciLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJpYXQiOjE2MzgzOTE1MDMsImV4cCI6MTY2OTkyNzUwM30.ijz_SSHXP03qtIr6Wm4QjtoI-9UGGPBxsEqFV4H-zCc',
      ),
    ).toBe(true)
  })
  it('raises exception on invalid API key formats', () => {
    expect(typeof validateApiKey('joadfoij')).toBe('string')
  })
})
