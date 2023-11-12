import React from "react"
import styled from "@emotion/styled"

const FrontPageSection = styled.section`
  margin: 100px 0;
  &:last-child {
    margin-bottom: 0;
  }
  &.gray-bg {
    margin: 0;
    padding: 100px 0;
    &:last-child {
      padding-bottom: 0;
    }
  }
`

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
    <div className={className + " page"}>
      <FrontPageSection>{renderAffiliateBlock()}</FrontPageSection>
      <FrontPageSection>
        <div className="container">{renderInfographic()}</div>
      </FrontPageSection>
      <FrontPageSection className="front-page-activity">
        <div className="activity-swoop">
          <div></div>
        </div>
        <div className="swoop-content gray-bg">
          <div className="container">{renderActivitySliderFront()}</div>
        </div>
      </FrontPageSection>
      <FrontPageSection className="gray-bg">
        {renderGetUpdates()}
      </FrontPageSection>
      <FrontPageSection className="gray-bg">
        {renderContributors()}
      </FrontPageSection>
    </div>
  </>
)
