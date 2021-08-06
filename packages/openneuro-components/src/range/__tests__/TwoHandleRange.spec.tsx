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
  it('fires event when changed', async () => {
    const onChange = jest.fn()
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
  it('returns Infinity when max range is uncapped', () => {
    const onChange = jest.fn()
    render(
      <TwoHandleRange
        min={0}
        max={20}
        step={10}
        value={[0, 20]}
        onChange={onChange}
        uncappedMax
      />,
    )
    const ranges = screen.queryAllByRole('slider')
    fireEvent.focus(ranges[0])
    fireEvent.keyDown(ranges[0], { key: 'ArrowRight', code: 'ArrowRight' })
    fireEvent.focus(ranges[1])
    fireEvent.keyDown(ranges[1], { key: 'ArrowRight', code: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith([0, Infinity])
  })
  it('sets a correct max value when value is set to [0, Infinity]', () => {
    const onChange = jest.fn()
    render(
      <TwoHandleRange
        min={0}
        max={20}
        step={10}
        value={[0, Infinity]}
        onChange={onChange}
        uncappedMax
      />,
    )
    const ranges = screen.queryAllByRole('slider')
    fireEvent.focus(ranges[1])
    fireEvent.keyDown(ranges[1], { key: 'ArrowLeft', code: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith([0, 10])
  })
})
