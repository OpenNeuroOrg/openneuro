import React from 'react'

import Markdown from 'markdown-to-jsx'
import { faq } from '../mock-content/faq-content'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { AccordionTab } from '../accordion/AccordionTab'

export interface FAQSProps {}

export const FAQS: React.FC<FAQSProps> = ({}) => {
  const faqsList = faq

  const faqs = faqsList.map((item, index) => {
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
