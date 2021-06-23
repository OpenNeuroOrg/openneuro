import React, { useState, useRef, useCallback, useEffect } from 'react'
import './TwoHandleRange.scss'

export function stepping(value, step) {
  return Math.round(value / step) * step
}

export interface TwoHandleRangeProps {
  // Minimum value for range
  min: number
  // Maximum value for range
  max: number
  // Integer step for range values
  step: number
  // [min, max] starting values
  defaultValue: [number, number]
  // Change event handler for either value changing, returns [minVal, maxVal]
  onChange: React.ChangeEvent<HTMLInputElement>
}

export const TwoHandleRange: React.FC<TwoHandleRangeProps> = ({
  min,
  max,
  step,
  defaultValue,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(defaultValue ? defaultValue[0] : min)
  const [maxVal, setMaxVal] = useState(defaultValue ? defaultValue[1] : max)
  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const range = useRef<HTMLDivElement>(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  )

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  const minChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = stepping(
      Math.min(Number(event.target.value), maxVal - 1),
      step,
    )
    setMinVal(value)
    minValRef.current = value
    onChange([value, maxVal])
  }
  const maxChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = stepping(
      Math.max(Number(event.target.value), minVal + 1),
      step,
    )
    setMaxVal(value)
    maxValRef.current = value
    onChange([minVal, value])
  }

  return (
    <div className="container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={minChangeHandler}
        onKeyDown={minChangeHandler}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={minVal}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && 5 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onChange={maxChangeHandler}
        onKeyDown={maxChangeHandler}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={maxVal}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  )
}
