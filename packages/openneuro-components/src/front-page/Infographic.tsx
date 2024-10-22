import React from "react"

import { frontPage } from "../content/front-page-content.jsx"

export const Infographic: React.FC = ({}) => {
  return (
    <div className="front-infographic">
      <span className="bg-circle"></span>
      {frontPage.infographic.map((item, index) => (
        <div key={index} className="infograph-block" id={item.htmlID}>
          <span>
            <img
              src={item.image}
              alt=""
              loading="lazy"
              width="312"
              height="349"
            />
          </span>
          <div className="info-card">
            <h3>{item.name}</h3>
            <div>{item.content}</div>
          </div>
        </div>
      ))}
      <div className="view-docs">
        <h3>Want to get started?</h3>
        Check out the{" "}
        <a href="https://docs.openneuro.org/user-guide">
          OpenNeuro User Documentation
        </a>
      </div>
    </div>
  )
}
