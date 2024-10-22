import React from "react"

import { affiliateContent } from "../content/affiliate-content.jsx"

import { AffiliateArticle } from "../affiliate-article/AffiliateArticle"

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
