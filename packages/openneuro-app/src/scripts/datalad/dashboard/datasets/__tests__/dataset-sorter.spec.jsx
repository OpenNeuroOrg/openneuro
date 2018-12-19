import React from 'react'
import { shallow } from 'enzyme'
import { SortField } from '../dataset-sorter.jsx'

describe('dashboard/datasets/DatasetSorter', () => {
  describe('SortField', () => {
    it('renders successfully', () => {
      expect(
        shallow(<SortField field="created" queryVariables={{ orderBy: {} }} />),
      ).toMatchSnapshot()
    })
    it('calls refetch on click', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <SortField
          field="created"
          queryVariables={{ orderBy: {} }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalled()
    })
    it('switches ascending to descending field when clicked', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <SortField
          field="created"
          queryVariables={{ orderBy: { created: 'ascending' } }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalledWith({
        orderBy: { created: 'descending' },
      })
    })
    it('switches to a new sort field when clicked', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <SortField
          field="stars"
          queryVariables={{ orderBy: { created: 'ascending' } }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalledWith({ orderBy: { stars: 'descending' } })
    })
    it('preserves unrelated fields when clicked', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <SortField
          field="created"
          queryVariables={{
            orderBy: { created: 'ascending' },
            filterBy: { public: true },
          }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalledWith({
        orderBy: { created: 'descending' },
        filterBy: { public: true },
      })
    })
  })
})
