import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CountToggle } from '../CountToggle'
import '@testing-library/jest-dom/extend-expect'

export const datasetType_available = [
  { label: 'All Public', value: 'All Public' },
  { label: 'Following', value: 'Following' },
  { label: 'My Datasets', value: 'My Datasets' },
  { label: 'My Bookmarks', value: 'My Bookmarks' },
]

describe('CountToggle component', () => {
  it('calls toggleClick on toggle', async () => {
    const toggleClick = jest.fn()
    const clicked = false
    const showClicked = jest.fn()
    const count = 3
    render(
      <CountToggle
        label="count toggle test"
        icon="fa-thumbtack"
        toggleClick={toggleClick}
        tooltip="test tip"
        clicked={clicked}
        showClicked={showClicked}
        count={count}
      />,
    )
    fireEvent.click(screen.getByText('count toggle test'))
    expect(toggleClick).toHaveBeenCalledTimes(1)
  })
})
