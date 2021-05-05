import React from 'react'
import './footer.scss'
import { frontPage } from '../mock-content/front-page-content'

export interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({ ...props }) => {
  return (
    <footer>
      <div className="grid grid-between align-center">
        <div className="col col-4  version">
          <span>OpenNeuro v{'1.1.1.TODO'}</span>
        </div>
        <div className="col col-4 privacy-policy">
          <span>
            <a href={frontPage.titlePanel.privacyLink}>
              {frontPage.pageTitle}
              &#39;s Privacy Policy
            </a>
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
