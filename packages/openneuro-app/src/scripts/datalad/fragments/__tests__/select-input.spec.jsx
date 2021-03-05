import React from 'react'
import { shallow } from 'enzyme'
import SelectInput from '../select-input'

describe('SelectInput', () => {
  it('handles display as disabled', () => {
    const wrapper = shallow(
      <SelectInput
        {...{
          name: 'Expected name',
          label: 'Expected label',
          value: 'hi',
          options: [{ value: 'hi' }, { value: 'bye' }],
          disabled: true,
          annotated: true,
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('handles display as not disabled', () => {
    const wrapper = shallow(
      <SelectInput
        {...{
          name: 'Expected name',
          label: 'Expected label',
          value: 'hi',
          options: [{ value: 'hi' }, { value: 'bye' }],
          disabled: false,
          annotated: false,
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('handles boolean display', () => {
    const wrapper = shallow(
      <SelectInput
        {...{
          name: 'Expected name',
          label: 'Expected label',
          value: true,
          options: [
            { value: true, text: 'true-label' },
            { value: false, text: 'false-label' },
          ],
          hasBooleanValues: true,
          disabled: true,
          annotated: true,
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('handles boolean values', () => {
    let _, value
    const onChange = (...args) => ([_, value] = args)
    const wrapper = shallow(
      <SelectInput
        {...{
          name: 'Expected name',
          label: 'Expected label',
          value: true,
          options: [
            { value: true, text: 'true-label' },
            { value: false, text: 'false-label' },
          ],
          hasBooleanValues: true,
          disabled: true,
          annotated: true,
          onChange,
        }}
      />,
    )
    const event = {
      preventDefault() {
        null
      },
      target: { value: 'false' },
    }
    wrapper.find('styledSelect[name="Expected name"]').simulate('change', event)
    expect(value).toBe(false)
  })
})
