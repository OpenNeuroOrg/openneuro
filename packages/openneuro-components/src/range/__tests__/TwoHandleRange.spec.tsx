import { vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TwoHandleRange } from '../TwoHandleRange'
import '@testing-library/jest-dom/extend-expect'

import { stepping } from '../TwoHandleRange'

describe('TwoHandleRange component', () => {
  describe('stepping()', () => {
    it('rounds to ten based steps', () => {
      expect(stepping(4, 10)).toBe(0)
      expect(stepping(15, 10)).toBe(20)
      expect(stepping(99, 10)).toBe(100)
    })
  })
  it('fires event when changed', () => {
    const onChange = vi.fn()
    render(
      <TwoHandleRange
        min={0}
        max={100}
        step={10}
        value={[0, 20]}
        onChange={onChange}
      />,
    )
    const ranges = screen.queryAllByRole('slider')
    fireEvent.focus(ranges[0])
    fireEvent.keyDown(ranges[0], { key: 'ArrowRight', code: 'ArrowRight' })
    fireEvent.focus(ranges[1])
    fireEvent.keyDown(ranges[1], { key: 'ArrowRight', code: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
