import React from 'react'
import { shallow } from 'enzyme'
import DatasetVirtualScroller from '../dataset-virtual-scroller.jsx'

const defProps = {
  datasets: [{ id: 1 }, { id: 2 }, { id: 3 }],
  pageInfo: {
    count: 3,
  },
  loadMoreRows: jest.fn(),
}

describe('dashboard/datasets/DatasetVirtualScroller', () => {
  it('shallow renders successfully', () => {
    expect(shallow(<DatasetVirtualScroller {...defProps} />)).toMatchSnapshot()
  })
  describe('_isRowLoaded()', () => {
    it('is bounded to pageInfo.count', () => {
      const wrapper = shallow(<DatasetVirtualScroller {...defProps} />)
      const instance = wrapper.instance()
      expect(instance._isRowLoaded({ index: 0 })).toBe(true)
      expect(instance._isRowLoaded({ index: 5 })).toBe(false)
      expect(instance._isRowLoaded({ index: 2 })).toBe(true)
    })
  })
  describe('shouldComponentUpdate()', () => {
    it('returns true with different dataset counts', () => {
      const wrapper = shallow(<DatasetVirtualScroller {...defProps} />)
      const instance = wrapper.instance()
      expect(instance.shouldComponentUpdate({ datasets: [] })).toBe(true)
    })
    it('returns true with the same list sorted differently', () => {
      const wrapper = shallow(<DatasetVirtualScroller {...defProps} />)
      const instance = wrapper.instance()
      expect(
        instance.shouldComponentUpdate({
          datasets: [
            defProps.datasets[1],
            defProps.datasets[0],
            defProps.datasets[2],
          ],
        }),
      ).toBe(true)
    })
    it('returns false for the same list', () => {
      const wrapper = shallow(<DatasetVirtualScroller {...defProps} />)
      const instance = wrapper.instance()
      expect(
        instance.shouldComponentUpdate({
          datasets: [...defProps.datasets],
        }),
      ).toBe(false)
    })
    it('returns false for the same list if another prop changes', () => {
      const wrapper = shallow(<DatasetVirtualScroller {...defProps} />)
      const instance = wrapper.instance()
      expect(
        instance.shouldComponentUpdate({
          datasets: [...defProps.datasets],
          loadMoreRows: jest.fn(),
        }),
      ).toBe(false)
    })
  })
})
