// dependencies -------------------------------------------------------

import React from 'react'
import Markdown from 'react-markdown'
import { faq } from 'openneuro-content'
import Helmet from 'react-helmet'
import { pageTitle } from '../resources/strings.js'

class Faq extends React.Component {
  render() {
    let faqsList = faq

    let faqs = faqsList.map((item, index) => {
      return (
        <div className="panel" key={index}>
          <Markdown source={item.faq} className="panel-heading" />
          <div className="panel-body">
            <span>
              <Markdown source={item.faq_answer} />
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
