import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TwoHandleRange } from '../TwoHandleRange'
import '@testing-library/jest-dom/extend-expect'

describe('TwoHandleRange component', () => {
  it.skip('fires event when changed', async () => {
    const setNewValue = jest.fn()
    render(
      <TwoHandleRange
        min={0}
        max={100}
        dots
        step={10}
        pushable={5}
        defaultValue={[0, 20]}
        marks={{ 0: '0', 50: '50', 100: '100' }}
        setNewValue={setNewValue}
        newvalue={[0, 20]}
      />,
    )
    const ranges = screen.queryAllByRole('slider')
    fireEvent.focus(ranges[0])
    fireEvent.keyDown(ranges[0], { key: 'ArrowRight', code: 'ArrowRight' })
    fireEvent.focus(ranges[1])
    fireEvent.keyDown(ranges[1], { key: 'ArrowRight', code: 'ArrowRight' })
    expect(setNewValue).toHaveBeenCalledTimes(2)
  })
})
