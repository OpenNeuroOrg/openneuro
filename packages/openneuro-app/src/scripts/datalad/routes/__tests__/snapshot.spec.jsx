import React from 'react'
import { shallow } from 'enzyme'
import { NoErrors } from '../snapshot.jsx'

describe('NoErrors component in SnapshotRoute', () => {
  it('handles extant errors case', () => {
    const issues = [{ severity: 'error' }]
    expect(
      shallow(
        <NoErrors issues={issues}>
          <div>child</div>
        </NoErrors>,
      ),
    ).toMatchSnapshot()
  })
  it('handles no authors case', () => {
    const issues = [{ severity: 'warning', code: 113, key: 'NO_AUTHORS' }]
    expect(
      shallow(
        <NoErrors issues={issues}>
          <div>child</div>
        </NoErrors>,
      ),
    ).toMatchSnapshot()
  })
  it('handles case of errors and no authors', () => {
    const issues = [
      { severity: 'error' },
      { severity: 'warning', code: 113, key: 'NO_AUTHORS' },
    ]
    expect(
      shallow(
        <NoErrors issues={issues}>
          <div>child</div>
        </NoErrors>,
      ),
    ).toMatchSnapshot()
  })
  it('returns children when issues are okay', () => {
    const issues = []
    expect(
      shallow(
        <NoErrors issues={issues}>
          <div>child</div>
        </NoErrors>,
      ),
    ).toMatchSnapshot()
  })
})
