import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { AccordionTab } from '../AccordionTab'

describe('AccordionTab component', () => {
  it('is open by default with startOpen prop', async () => {
    render(
      <AccordionTab
        id="test"
        className=""
        label="test"
        startOpen
        accordionStyle="plain">
        Child Element Text
      </AccordionTab>,
    )
    expect(await screen.getByText(/Child Element Text/)).toBeVisible()
  })
  it('displays an icon when accordionStyle = "fileTree"', async () => {
    render(
      <AccordionTab
        id="test"
        className=""
        label="test"
        startOpen
        accordionStyle="file-tree">
        Child Element Text
      </AccordionTab>,
    )
    expect(await screen.getByText(/Child Element Text/)).toBeInTheDocument()
    expect(await screen.getByRole('img')).toBeInTheDocument()
  })
})
