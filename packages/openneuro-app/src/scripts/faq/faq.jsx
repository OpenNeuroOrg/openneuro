// dependencies -------------------------------------------------------

import React from 'react'
import Markdown from 'markdown-to-jsx'
import { faq } from './faq-content'
import Helmet from 'react-helmet'
import { pageTitle } from '../resources/strings.js'

class Faq extends React.Component {
  render() {
    const faqsList = faq

    const faqs = faqsList.map((item, index) => {
      return (
        <div className="panel" key={index}>
          <Markdown options={{ forceBlock: true }} className="panel-heading">
            {item.faq}
          </Markdown>
          <div className="panel-body">
            <span>
              <Markdown>{item.answer}</Markdown>
            </span>
          </div>
        </div>
      )
    })

    return (
      <>
        <Helmet>
          <title>Frequently Asked Questions - {pageTitle}</title>
        </Helmet>
        <div className="container faqs">
          <h1>{"FAQ's"}</h1>
          {faqs}
        </div>
      </>
    )
  }
}

export default Faq
