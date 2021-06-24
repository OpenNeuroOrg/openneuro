import React from 'react'
import { Logo } from '../logo/Logo'

import { frontPage } from '../mock-content/front-page-content.jsx'

export interface ContributersProps {}

export const Contributors: React.FC<ContributersProps> = ({}) => {
  return (
    <div className="contributors">
      <div className="container">
        <div className="contributor-logo-header">
          <Logo dark horizontal={false} />

          <h3>Support for {frontPage.pageTitle} provided by</h3>
        </div>
        <div className="contributors-wrap">
          {frontPage.support.map((item, index) => (
            <div key={index} className="contributor">
              <a
                target="_blank"
                href={item.link}
                title={item.title}
                rel="noopener noreferrer">
                <img src={item.logo} alt={item.alt} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
