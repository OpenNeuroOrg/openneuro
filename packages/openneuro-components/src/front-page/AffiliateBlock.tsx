import React from 'react'

import { affiliateContent } from '../content/affiliate-content.jsx'

import { AffiliateArticle } from '../affiliate-article/AffiliateArticle'

export interface AffiliateBlockProps {}

export const AffiliateBlock: React.FC<AffiliateBlockProps> = () => {
  return (
    <div className="container affiliate-wrap">
      <div className="grid grid-between">
        {affiliateContent.map((item, index) => (
          <div className="col col-3">
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
