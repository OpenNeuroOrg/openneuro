import React from 'react'

import { affiliateContent } from '../mock-content/affiliate-content.jsx'

import { AffiliateArticle } from '../affiliate-article/AffiliateArticle'

export interface AffiliateBlockProps {}

export const AffiliateBlock: React.FC<AffiliateBlockProps> = () => {
  return (
    <div className="container affiliate-wrap">
      <div className="grid grid-between">
        {affiliateContent.map((item, index) => (
          <div className="col col-4" key={index}>
            <AffiliateArticle
              logo={item.logo}
              key={index}
              header={item.header}
              contentOne={item.contentOne}
              contentTwo={item.contentTwo}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
