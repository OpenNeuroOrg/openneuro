import React from "react"

import { affiliateContent } from "../../common/content/affiliate-content.jsx"
import { AffiliateArticle } from "../affiliate-article/AffiliateArticle"

import "./front-page.scss"

export const AffiliateBlock: React.FC = () => {
  return (
    <div className=" affiliate-wrap">
      {affiliateContent.map((item, index) => (
        <AffiliateArticle
          logo={item.logo}
          key={index}
          header={item.header}
          contentOne={item.contentOne}
          contentTwo={item.contentTwo}
        />
      ))}
    </div>
  )
}
