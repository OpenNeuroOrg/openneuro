import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import './forms.scss'

export interface TwoHandleRangeProps {
  min: number
  max: number
  step: number
  dots: boolean
  pushable: number | boolean
  defaultValue: [number, number]
  onChange: React.MouseEventHandler<HTMLInputElement>
  marks: { number: string }
}

export const TwoHandleRange: React.FC<TwoHandleRangeProps> = ({
  min,
  max,
  step,
  dots,
  pushable,
  defaultValue,
  onChange,
  marks,
}) => {
  const createSliderWithTooltip = Slider.createSliderWithTooltip
  const Range = createSliderWithTooltip(Slider.Range)

  return (
    <div className="formRange-inner">
      <Range
        min={min}
        max={max}
        step={step}
        dots={dots}
        pushable={pushable}
        defaultValue={defaultValue}
        onChange={onChange}
        marks={marks}
      />
    </div>
  )
}
