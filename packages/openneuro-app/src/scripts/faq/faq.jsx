// dependencies -------------------------------------------------------

import React from 'react'
import Markdown from 'react-markdown'
import faqsList from '../../assets/configuration/faqs.js'

class Faq extends React.Component {
  render() {
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
      <div className="container faqs">
        <h1>{"FAQ's"}</h1>
        {faqs}
      </div>
    )
  }
}

export default Faq
