import { formatDate } from '../date.js'

describe('utils/date.js', () => {
  it('returns an YYYY-MM-DD date', () => {
    const beginningOfTime = new Date(0)
    expect(formatDate(beginningOfTime)).toBe('1970-01-01')
  })
})
