import React from 'react'
import configurables from './front-page-config'

class Support extends React.Component {
  render() {
    let support = configurables.support.map((item, index) => {
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
        <h4>Support for {configurables.pageTitle} provided by</h4>
        <div className="row">{support}</div>
      </div>
    )
  }
}

export default Support
