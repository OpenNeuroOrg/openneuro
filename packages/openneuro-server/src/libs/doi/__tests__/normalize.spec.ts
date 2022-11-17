import { normalizeDOI } from '../normalize'

vi.mock('ioredis')

describe('DOI normalize utility', () => {
  it('returns null for non-DOI input', () => {
    expect(normalizeDOI('Sphinx of black quartz, judge my vow.')).toBe(null)
  })
  it('returns the raw DOI value from a raw input', () => {
    expect(normalizeDOI('10.18112/openneuro.ds000001.v1.0.0')).toBe(
      '10.18112/openneuro.ds000001.v1.0.0',
    )
  })
  it('returns the raw DOI value from a URI input', () => {
    expect(normalizeDOI('doi:10.18112/openneuro.ds000001.v1.0.0')).toBe(
      '10.18112/openneuro.ds000001.v1.0.0',
    )
    expect(normalizeDOI('DOI:10.18112/openneuro.ds000001.v1.0.0')).toBe(
      '10.18112/openneuro.ds000001.v1.0.0',
    )
  })
  it('returns the raw DOI value from a URI input', () => {
    expect(
      normalizeDOI('https://doi.org/10.18112/openneuro.ds000001.v1.0.0'),
    ).toBe('10.18112/openneuro.ds000001.v1.0.0')
    expect(
      normalizeDOI('HTTPS://DOI.ORG/10.18112/openneuro.ds000001.v1.0.0'),
    ).toBe('10.18112/openneuro.ds000001.v1.0.0')
  })
})
