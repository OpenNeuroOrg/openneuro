import React from "react"
import { Radio } from "./Radio"
import "./radio.scss"

export interface RadioGroupProps {
  layout: string
  // if radioArr is string[]
  // then the string items are both the label and value for the radio buttons
  radioArr: (
    | string
    | {
      label: string
      onChange?: React.MouseEventHandler<HTMLInputElement>
      value: string
    }
  )[]
  name: string
  selected: string
  setSelected: (value) => void
  additionalText?: string
}

const get = (obj, property) => (typeof obj === "object" ? obj[property] : obj)

export const RadioGroup = ({
  radioArr,
  layout,
  name,
  selected,
  setSelected,
  additionalText,
}: RadioGroupProps) => {
  return (
    <div className={"on-radio-wrapper" + " " + layout}>
      {radioArr.map((item, index) => (
        <Radio
          key={index}
          name={name}
          value={get(item, "value")}
          label={get(item, "label")}
          checked={selected === get(item, "value")}
          onChange={(e) => setSelected(e.target.value)}
        />
      ))}
      {additionalText && <div className="additional-text">{additionalText}
      </div>}
    </div>
  )
}
