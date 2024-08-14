import React from "react"
import { Link } from "react-router-dom"
import { frontPage } from "../content/front-page-content"

export interface FooterProps {
  version: string
}

export const Footer: React.FC<FooterProps> = ({ version }) => {
  return (
    <footer className="on-foot">
      <div className="grid grid-between align-center">
        <div className="col col-4  version">
          <span>OpenNeuro v{version}</span>
        </div>
        <div className="col col-4 privacy-policy">
          <span>
            <a href={frontPage.titlePanel.privacyLink}>
              Privacy Policy
            </a>
          </span>{" "}
          &{" "}
          <span>
            <Link to="/terms">
              Terms
            </Link>
          </span>
        </div>
        <div className="col col-4  copy">
          <span>
            &copy; {new Date().getFullYear()} {frontPage.copyright.holder}
          </span>
        </div>
      </div>
    </footer>
  )
}
