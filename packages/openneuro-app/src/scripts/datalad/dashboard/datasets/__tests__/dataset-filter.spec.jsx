import React from 'react'
import { shallow } from 'enzyme'
import { FilterField } from '../dataset-filter.jsx'

describe('dashboard/datasets/DatasetFilter', () => {
  describe('FilterField', () => {
    it('renders successfully', () => {
      expect(
        shallow(<FilterField field="all" queryVariables={{ filterBy: {} }} />),
      ).toMatchSnapshot()
    })
    it('calls refetch on click', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <FilterField
          field="public"
          queryVariables={{ filterBy: {} }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalled()
    })
    it('toggles the active query field when clicked', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <FilterField
          field="public"
          queryVariables={{ filterBy: { public: true } }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalledWith({ filterBy: { public: false } })
    })
    it('switches to a new query field when clicked', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <FilterField
          field="public"
          queryVariables={{ filterBy: { shared: true } }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalledWith({ filterBy: { public: true } })
    })
    it('preserves unrelated fields when toggled', () => {
      const refetch = jest.fn()
      const wrapper = shallow(
        <FilterField
          field="public"
          queryVariables={{
            orderBy: { downloads: 'ascending' },
            filterBy: { public: true },
          }}
          refetch={refetch}
        />,
      )
      wrapper.simulate('click')
      expect(refetch).toHaveBeenCalledWith({
        filterBy: { public: false },
        orderBy: { downloads: 'ascending' },
      })
    })
  })
})
