import React from 'react'
import { render, screen } from '@testing-library/react'
import { Textarea } from '../Textarea'
import '@testing-library/jest-dom/extend-expect'

describe('Textarea component', () => {
  it('supports inline type', () => {
    render(<Textarea type="inline" name="inline test" label="in-label" />)
    const textbox = screen.getByRole('textbox')
    expect(textbox).toBeInTheDocument()
    expect(textbox.closest('div')).toHaveClass('inline')
    expect(screen.getByText('in-label')).toBeInTheDocument()
  })
  it('supports float type', () => {
    render(<Textarea type="float" name="float test" label="float-label" />)
    const textbox = screen.getByRole('textbox')
    expect(textbox).toBeInTheDocument()
    expect(textbox.closest('div')).toHaveClass('float-form-style')
    expect(screen.getByText('float-label')).toBeInTheDocument()
  })
  it('supports default type', () => {
    render(<Textarea name="default test" label="default-label" />)
    const textbox = screen.getByRole('textbox')
    expect(textbox).toBeInTheDocument()
    expect(textbox.closest('div')).toHaveClass('form-control')
    expect(textbox.closest('div')).not.toHaveClass('inline')
    expect(textbox.closest('div')).not.toHaveClass('float-form-style')
    expect(screen.getByText('default-label')).toBeInTheDocument()
  })
})
