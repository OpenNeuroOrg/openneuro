import React from 'react'
import { mount } from 'enzyme'
import EditList from '../edit-list.jsx'

// Mount is used because enzyme does not yet support hooks
describe('EditList component', () => {
  it('renders with default props', () => {
    const wrapper = mount(<EditList />)
    expect(wrapper).toMatchSnapshot()
  })
  it('calls setElements when an item is added', () => {
    const setElements = jest.fn()
    const wrapper = mount(<EditList setElements={setElements} />)
    wrapper.find('button[children="Add"]').simulate('click')
    // Added an empty string to an empty list
    expect(setElements).toHaveBeenCalledWith([''])
  })
  it('renders any elements', () => {
    const wrapper = mount(<EditList elements={['One', 'Two']} />)
    const values = wrapper.find('span.input-group-addon')
    expect(values).toHaveLength(2)
    expect(values.at(0).text()).toBe('One')
    expect(values.at(1).text()).toBe('Two')
  })
})
