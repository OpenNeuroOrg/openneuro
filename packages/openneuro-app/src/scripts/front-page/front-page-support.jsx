import React from 'react'
import { frontPage } from 'openneuro-content'

class Support extends React.Component {
  render() {
    const support = frontPage.support.map((item, index) => {
      return (
        <div
          key={index}
          className={`col-sm-offset-${item.offset} col-sm-${item.width}`}>
          <a
            target="_blank"
            href={item.link}
            title={item.title}
            rel="noopener noreferrer">
            <img src={item.logo} alt={item.alt} />
          </a>
        </div>
      )
    })
    return (
      <div className="support-more">
        <h4>Support for {frontPage.pageTitle} provided by</h4>
        <div className="row">{support}</div>
      </div>
    )
  }
}

export default Support
