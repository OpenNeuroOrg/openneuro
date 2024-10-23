import React from "react"
import { Logo } from "../logo/Logo"

import { frontPage } from "../content/front-page-content.jsx"

export const Contributors: React.FC = () => {
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
              <a href={item.link} title={item.title}>
                <img src={item.logo} alt={item.alt} loading="lazy" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
