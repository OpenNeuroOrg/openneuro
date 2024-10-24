import React, { useCallback, useEffect, useRef } from "react"

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
  value: [number, number]
  // Change event handler for either value changing, returns [minVal, maxVal]
  onChange: (value: [number, number]) => void
  // At max value interpret this as any value greater than min
  uncappedMax?: boolean
}

export const TwoHandleRange: React.FC<TwoHandleRangeProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  uncappedMax = false,
}) => {
  const range = useRef<HTMLDivElement>(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  )

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(value[0])
    const maxPercent = getPercent(value[1])

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [value[0], getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(value[0])
    const maxPercent = getPercent(value[1])

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [value[1], getPercent])

  const minChangeHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const changeEvent = event as React.ChangeEvent<HTMLInputElement>
    const discreteValue = stepping(
      Math.min(Number(changeEvent.target.value), value[1] - 1),
      step,
    )
    onChange([discreteValue, value[1]])
  }
  const maxChangeHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const changeEvent = event as React.ChangeEvent<HTMLInputElement>
    const discreteValue = stepping(
      Math.max(Number(changeEvent.target.value), value[0] + 1),
      step,
    )
    onChange([value[0], discreteValue])
  }

  const leftValue = value[0]
  const rightValue = uncappedMax
    ? (value[1] === max && `${value[1]}+`) || value[1]
    : value[1]

  return (
    <div className="formRange-inner">
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        step={step}
        onChange={minChangeHandler}
        onKeyDown={minChangeHandler}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[0]}
        className="thumb thumb--left"
        style={{ zIndex: value[0] > max - 100 && 5 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        step={step}
        onChange={maxChangeHandler}
        onKeyDown={maxChangeHandler}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <div className="slider__left-value">{leftValue}</div>
        <div className="slider__right-value">{rightValue}</div>
      </div>
    </div>
  )
}
