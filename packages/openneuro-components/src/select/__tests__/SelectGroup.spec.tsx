import { vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectGroup } from '../SelectGroup'
import '@testing-library/jest-dom/extend-expect'

const SelectContent = [
  { label: '--Select--', value: '' },
  { label: 'Option-1', value: 'option1' },
  { label: 'Option-2', value: 'option2' },
  { label: 'Option-3', value: 'option3' },
  { label: 'Option-4', value: 'option4' },
]

describe('SelectGroup component', () => {
  it('renders options', async () => {
    const setValue = vi.fn()
    render(
      <SelectGroup
        id="test-select"
        options={SelectContent}
        value=""
        layout="inline"
        setValue={setValue}
      />,
    )
    expect(await screen.queryAllByRole('option')).toHaveLength(5)
  })
  it('is selectable', async () => {
    const setValue = vi.fn()
    render(
      <SelectGroup
        id="test-select"
        options={SelectContent}
        value=""
        setValue={setValue}
        layout="inline"
      />,
    )
    const select = await screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option4' } })
    expect(setValue).toHaveBeenCalledWith('option4')
  })
})
