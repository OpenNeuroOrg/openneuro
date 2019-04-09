import parseTabular from '../parse-tabular.js'

const demoCsv = `participant_id,age,sex
sub-01,M,28
sub-02,F,30
sub-03,F,27
`

const demoTsv = `participant_id age sex
sub-01  M 28
sub-02  F 30
`

describe('parseTabular()', () => {
  it('returns an array', () => {
    expect(Array.isArray(parseTabular(demoCsv, ','))).toBe(true)
  })
  it('returns the expected number of data rows', () => {
    expect(parseTabular(demoCsv, ',')).toHaveLength(3)
  })
  it('works with tab separators', () => {
    expect(parseTabular(demoTsv, '\t')).toHaveLength(2)
  })
})
