import React from 'react'
import { shallow } from 'enzyme'
import ArrayInput from '../array-input'

const emptyModel = []
const emptyValue = []

const hiddenCheckboxModel = [
  {
    id: 'license-key',
    type: 'checkbox',
  },
]
const hiddenCheckboxValue = ['false']

describe('common/forms/ArrayInput', () => {
  it('renders successfully', () => {
    const wrapper = shallow(
      <ArrayInput model={emptyModel} value={emptyValue} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders a hidden checkbox', () => {
    const wrapper = shallow(
      <ArrayInput model={hiddenCheckboxModel} value={hiddenCheckboxValue} />,
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('button > span').exists()).toBe(true)
    expect(wrapper.find('button > span').text()).toBe(' Hidden')
  })
})
