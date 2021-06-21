import React from 'react'

import './front-page.scss'

export interface FrontPageProps {
  renderAffiliateBlock: () => React.ReactNode
  renderInfographic: () => React.ReactNode
  renderActivitySliderFront: () => React.ReactNode
  renderGetUpdates: () => React.ReactNode
  renderContributors: () => React.ReactNode
  className?: string
}

export const FrontPage: React.FC<FrontPageProps> = ({
  renderAffiliateBlock,
  renderInfographic,
  renderActivitySliderFront,
  renderGetUpdates,
  renderContributors,
  className,
}) => (
  <>
    <div className={className + ' page'}>
      <section>{renderAffiliateBlock()}</section>
      <section>
        <div className="container">{renderInfographic()}</div>
      </section>
      <section className="front-page-activity">
        <div className="activity-swoop">
          <div></div>
        </div>
        <div className="swoop-content gray-bg">
          <div className="container">{renderActivitySliderFront()}</div>
        </div>
      </section>
      <section className="gray-bg">{renderGetUpdates()}</section>
      <section className="gray-bg">{renderContributors()}</section>
    </div>
  </>
)
