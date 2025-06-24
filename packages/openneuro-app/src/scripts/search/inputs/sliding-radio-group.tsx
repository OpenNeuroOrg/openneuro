import React, { useCallback, useEffect, useRef, useState } from "react"
import type { FC } from "react"

import "../scss/sliding-radio-group.scss"

interface RadioItem {
  value: string
  label: string
}

interface SlidingRadioGroupProps {
  items: (string | RadioItem)[]
  selected: string | undefined
  setSelected: (value: string) => void
  groupName: string
  className?: string
  initialSelectedValueOverride?: string
}

const SlidingRadioGroup: FC<SlidingRadioGroupProps> = ({
  items,
  selected,
  setSelected,
  groupName,
  className = "",
  initialSelectedValueOverride,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const radioLabelRefs = useRef<{ [key: string]: HTMLLabelElement }>({})
  const [sliderStyles, setSliderStyles] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
  })

  const calculateSliderPosition = useCallback((targetValue: string) => {
    if (!containerRef.current || !radioLabelRefs.current[targetValue]) {
      return { left: 0, width: 0, height: 0, top: 0 }
    }

    const targetLabel = radioLabelRefs.current[targetValue]
    const containerRect = containerRef.current.getBoundingClientRect()
    const labelRect = targetLabel.getBoundingClientRect()

    return {
      left: labelRect.left - containerRect.left,
      width: labelRect.width,
      height: labelRect.height,
      top: labelRect.top - containerRect.top,
    }
  }, [])

  useEffect(() => {
    const updateSlider = () => {
      const valueToCalculate = initialSelectedValueOverride || selected

      if (valueToCalculate) {
        const newStyles = calculateSliderPosition(valueToCalculate)
        setSliderStyles(newStyles)
      } else {
        setSliderStyles({ left: 0, width: 0, height: 0, top: 0 })
      }
    }

    const timeoutId = setTimeout(updateSlider, 50)

    window.addEventListener("resize", updateSlider)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", updateSlider)
    }
  }, [selected, calculateSliderPosition, initialSelectedValueOverride])

  const isSliderVisible = sliderStyles.width > 0 && sliderStyles.height > 0

  return (
    <div
      className={`sliding-radio-group-root ${className} btn-group-wrapper facet-radio show-dataset-radios-container`}
      ref={containerRef}
    >
      {/* The sliding highlight element */}
      <div
        className="sliding-highlight"
        style={{
          left: sliderStyles.left,
          width: sliderStyles.width,
          height: sliderStyles.height - 2,
          top: sliderStyles.top,
          opacity: isSliderVisible ? 1 : 0,
        }}
      />

      {/* The container for the actual radio buttons */}
      <div className="show-dataset-radios-group">
        {items.map((item) => {
          const value = typeof item === "object" ? item.value : item
          const label = typeof item === "object" ? item.label : item
          const isChecked = selected === value

          return (
            <div className="dataset-filter-radio" key={value}>
              <input
                type="radio"
                id={`${groupName}-${value.replace(/\s/g, "")}`}
                name={groupName}
                value={value}
                checked={isChecked}
                onChange={() => setSelected(value)}
              />
              <label
                htmlFor={`${groupName}-${value.replace(/\s/g, "")}`}
                ref={(el) => {
                  if (el) radioLabelRefs.current[value] = el
                }}
                className={isChecked ? "is-active" : ""}
              >
                {label}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SlidingRadioGroup
