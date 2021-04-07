import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { DropdownButton } from '../dropdown-button'

const titleid = 'test-title'
const dropdownid = 'test-dropdown'
function renderDropdownButton() {
  const title = <i className="fa fa-gear" data-testid={titleid} />
  render(
    <DropdownButton id="user-menu" title={title}>
      <ul data-testid={dropdownid}>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
    </DropdownButton>,
  )
}

describe('DropdownButton component', () => {
  it('does not open on hover', async () => {
    renderDropdownButton()

    fireEvent.mouseOver(screen.getByTestId(titleid))

    expect(screen.queryByText('Menu Item 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Menu Item 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Menu Item 3')).not.toBeInTheDocument()
  })
  it('toggle expands the dropdown menu (children) on click', async () => {
    renderDropdownButton()

    expect(screen.queryByText('Menu Item 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Menu Item 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Menu Item 3')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId(titleid))

    expect(screen.getByText('Menu Item 1')).toBeInTheDocument()
    expect(screen.getByText('Menu Item 2')).toBeInTheDocument()
    expect(screen.getByText('Menu Item 3')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId(titleid))

    expect(screen.queryByText('Menu Item 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Menu Item 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Menu Item 3')).not.toBeInTheDocument()
  })
})
