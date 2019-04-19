import React from 'react'
import { shallow } from 'enzyme'
import { DatasetCountDisplay } from '../dataset-count.jsx'

describe('DatasetCount', () => {
  describe('DatasetCountDisplay', () => {
    it('returns null while loading', () => {
      expect(shallow(<DatasetCountDisplay loading={true} />).getElement()).toBe(
        null,
      )
    })
    it('returns a number if data is available', () => {
      expect(
        shallow(
          <DatasetCountDisplay
            loading={false}
            data={{ datasets: { pageInfo: { count: 10 } } }}
          />,
        ).text(),
      ).toBe('10')
    })
    it('returns null if some other data is provided', () => {
      expect(
        shallow(
          <DatasetCountDisplay
            loading={false}
            data={{ datasets: { pageInfo: { notCount: -25 } } }}
          />,
        ).getElement(),
      ).toBe(null)
    })
  })
})
