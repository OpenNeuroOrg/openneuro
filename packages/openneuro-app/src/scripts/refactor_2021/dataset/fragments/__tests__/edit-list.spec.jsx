import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import EditList from '../edit-list.jsx'

describe('EditList component', () => {
  it('renders with default props', () => {
    const { asFragment } = render(<EditList />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('calls setElements when an item is added', () => {
    const testText = 'this is a test entry'
    const setElements = jest.fn()
    render(<EditList setElements={setElements} />)
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: testText },
    })
    fireEvent.click(screen.getByLabelText('Add'))
    // Added an empty string to an empty list
    expect(setElements).toHaveBeenCalledWith([testText])
  })
  it('renders any elements', () => {
    render(<EditList elements={['One', 'Two']} />)
    expect(screen.getByText('One')).toBeVisible()
    expect(screen.getByText('Two')).toBeVisible()
  })
})
