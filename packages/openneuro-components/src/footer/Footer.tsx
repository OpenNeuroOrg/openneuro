import React from "react"
import { Link } from "react-router-dom"
import { frontPage } from "../content/front-page-content"

export interface FooterProps {
  version: string
}

export const Footer: React.FC<FooterProps> = ({ version }) => {
  const versionLink =
    `https://github.com/OpenNeuroOrg/openneuro/releases/tag/v${version}`
  return (
    <footer className="on-foot">
      <div className="grid grid-between align-center">
        <div className="col col-4  version">
          <span>
            OpenNeuro
            <a href={versionLink}>
              {" "}v{version}
            </a>
          </span>
        </div>
        <div className="col col-4 privacy-policy">
          <span>
            <a href={frontPage.titlePanel.privacyLink}>
              Privacy Policy
            </a>
          </span>
          {", "}
          <span>
            <Link to="/terms">
              Terms
            </Link>
          </span>
          {", "}
          &{" "}
          <span>
            <Link to="/image-attribution">
              Image Attribution
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
