import { validateUrl } from '../validateUrl'

vi.mock('ioredis')

describe('validateUrl', () => {
  it('returns true for a regular HTTPS url', () => {
    expect(validateUrl('https://openneuro.org')).toBe(true)
  })
  it('returns false for a regular HTTP url', () => {
    expect(validateUrl('http://openneuro.org')).toBe(false)
  })
  it('returns false for something that is not really a URL', () => {
    expect(validateUrl('openneuro.org/robots.txt')).toBe(false)
  })
})
