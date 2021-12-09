import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import SelectInput from '../select-input'

describe('SelectInput', () => {
  it('handles display as disabled', () => {
    const { asFragment } = render(
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
    expect(asFragment()).toMatchSnapshot()
  })
  it('handles display as not disabled', () => {
    const { asFragment } = render(
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
    expect(asFragment()).toMatchSnapshot()
  })
  it('handles boolean display', () => {
    const { asFragment } = render(
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
    expect(asFragment()).toMatchSnapshot()
  })
  it('handles boolean values', () => {
    let _, value
    const onChange = (...args) => ([_, value] = args)
    render(
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
    fireEvent.change(screen.getByRole('combobox'), event)
    expect(value).toBe(false)
  })
})
