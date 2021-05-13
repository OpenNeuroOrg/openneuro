import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import './range.scss'

export interface TwoHandleRangeProps {
  min: number
  max: number
  step: number
  dots: boolean
  pushable: number | boolean
  defaultValue: [number, number]
  marks: { number: string }
  newvalue: [number, number]
  setNewValue: [number, number]
}

export const TwoHandleRange: React.FC<TwoHandleRangeProps> = ({
  min,
  max,
  step,
  dots,
  pushable,
  defaultValue,
  marks,
  setNewValue,
}) => {
  const createSliderWithTooltip = Slider.createSliderWithTooltip
  const Range = createSliderWithTooltip(Slider.Range)
  const setSetter = value => {
    console.log(value)
    //setNewValue(value)
  }
  return (
    <div className="formRange-inner">
      <Range
        min={min}
        max={max}
        step={step}
        dots={dots}
        pushable={pushable}
        defaultValue={defaultValue}
        onChange={value => setSetter(value)}
        marks={marks}
      />
    </div>
  )
}
