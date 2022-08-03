import React from 'react'

import Markdown from 'markdown-to-jsx'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'

export interface FAQSProps {
  content: Record<string, any>
}

export const FAQS: React.FC<FAQSProps> = ({ content }) => {
  const faqs = content.map((item, index) => {
    return (
      <AccordionTab
        accordionStyle="plain"
        className="faq-item"
        label={item.faq}
        key={index}
        startOpen={true}>
        <Markdown>{item.answer}</Markdown>
      </AccordionTab>
    )
  })

  return (
    <>
      <AccordionWrap className="faqs-accordion">
        <div className="container faqs">
          <h1>FAQ's</h1>
          {faqs}
        </div>
      </AccordionWrap>
    </>
  )
}
