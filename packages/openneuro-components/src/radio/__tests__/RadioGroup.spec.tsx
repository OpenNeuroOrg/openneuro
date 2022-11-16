import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup } from '../RadioGroup'
import '@testing-library/jest-dom/extend-expect'

export const datasetType_available = [
  { label: 'All Public', value: 'All Public' },
  { label: 'Following', value: 'Following' },
  { label: 'My Datasets', value: 'My Datasets' },
  { label: 'My Bookmarks', value: 'My Bookmarks' },
]

describe('RadioGroup component', () => {
  it('has selectable options', async () => {
    const setSelected = vi.fn()
    render(
      <RadioGroup
        setSelected={setSelected}
        selected={'All Public'}
        name="name"
        radioArr={datasetType_available}
        layout="row"
      />,
    )
    // Check an option is rendered
    expect(await screen.getByText(/Following/)).toBeInTheDocument()
    const followingRadio = screen.getByText('Following')
    fireEvent.click(followingRadio)
    expect(setSelected).toHaveBeenCalledWith('Following')
  })
})
