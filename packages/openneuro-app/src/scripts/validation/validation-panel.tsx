import React from "react"
import { AccordionTab, AccordionWrap } from "@openneuro/components/accordion"

interface ValidationPanelProps {
  heading: React.ReactNode
  children: React.ReactNode
}

export function ValidationPanel({ heading, children }: ValidationPanelProps) {
  return (
    <AccordionWrap className="validation-wrap">
      <AccordionTab
        className="status"
        accordionStyle="plain"
        label={heading}
      >
        {children}
      </AccordionTab>
    </AccordionWrap>
  )
}

export default ValidationPanel
