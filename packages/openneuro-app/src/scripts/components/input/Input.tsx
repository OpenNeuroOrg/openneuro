import React from "react"
import { AccordionTab } from "../accordion/AccordionTab"
import { AccordionWrap } from "../accordion/AccordionWrap"
import "./input.scss"

export type InputPropsStyle = "inline" | "float" | "default"

export interface InputProps {
  placeholder: string
  type: string
  disabled?: boolean
  label?: string
  name: string
  labelStyle?: InputPropsStyle
  value?: string
  setValue?: (string) => void
  onKeyDown?(event): void
  tipContent?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  label,
  name,
  labelStyle,
  setValue,
  value,
  tipContent,
  onKeyDown = () => {},
}) => {
  return (
    <>
      {labelStyle == "float"
        ? (
          <div className="form-control float-form-style">
            <input
              type={type}
              name={name}
              id={name}
              value={value}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
            {label
              ? (
                <label htmlFor={name}>
                  {label}
                  {tipContent
                    ? (
                      <AccordionWrap>
                        <AccordionTab
                          accordionStyle="plain"
                          label="?"
                          className="keyword-accordion"
                        >
                          {tipContent}
                        </AccordionTab>
                      </AccordionWrap>
                    )
                    : null}
                </label>
              )
              : null}
          </div>
        )
        : labelStyle == "inline"
        ? (
          <div className="form-control inline">
            {label
              ? (
                <label htmlFor={name}>
                  {label}
                  {tipContent
                    ? (
                      <AccordionWrap>
                        <AccordionTab
                          accordionStyle="plain"
                          label="?"
                          className="keyword-accordion"
                        >
                          {tipContent}
                        </AccordionTab>
                      </AccordionWrap>
                    )
                    : null}
                </label>
              )
              : null}
            <input
              value={value}
              type={type}
              name={name}
              id={name}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        )
        : (
          <div className="form-control ">
            {label
              ? (
                <label htmlFor={name}>
                  {label}
                  {tipContent
                    ? (
                      <AccordionWrap>
                        <AccordionTab
                          accordionStyle="plain"
                          label="?"
                          className="keyword-accordion"
                        >
                          {tipContent}
                        </AccordionTab>
                      </AccordionWrap>
                    )
                    : null}
                </label>
              )
              : null}
            <input
              value={value}
              type={type}
              name={name}
              id={name}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        )}
    </>
  )
}
