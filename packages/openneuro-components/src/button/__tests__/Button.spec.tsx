import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button component', () => {
  it('is clickable', () => {
    const onClick = jest.fn()
    render(<Button label="Primary" primary onClick={onClick} />)
    expect(onClick).not.toBeCalled()
    fireEvent.click(screen.getByText(/Primary/))
    expect(onClick).toBeCalled()
  })
  it('is not clickable while disabled', () => {
    const onClick = jest.fn()
    render(<Button label="Primary" primary onClick={onClick} disabled />)
    expect(onClick).not.toBeCalled()
    fireEvent.click(screen.getByText(/Primary/))
    expect(onClick).not.toBeCalled()
  })
})
