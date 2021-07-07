import React from 'react'

import { Button } from '../button/Button'
import { ModalityCube } from '../modality-cube/ModalityCube'
import { cubeData } from '../mock-content/modality-cube-content.jsx'
import orcidIcon from '../assets/orcid_24x24.png'

import { frontPage } from '../mock-content/front-page-content.jsx'

export interface LandingExpandedHeaderProps {
  user?: {}
  loginUrls?: Record<string, string>
  renderAggregateCounts?: (label?: string) => React.ReactNode
  renderFacetSelect: () => React.ReactNode
  renderSearchInput: () => React.ReactNode
  onSearch: () => void
}

export const LandingExpandedHeader: React.FC<LandingExpandedHeaderProps> = ({
  user,
  loginUrls,
  renderAggregateCounts,
  renderFacetSelect,
  renderSearchInput,
  onSearch,
}) => {
  const aggregateCounts = (modality: string): React.ReactNode =>
    renderAggregateCounts ? renderAggregateCounts(modality) : null
  const hexGrid = (
    <ul id="hexGrid">
      {cubeData.map((item, index) => (
        <ModalityCube
          key={index}
          label={item.label}
          cubeImage={item.cubeImage}
          stats={aggregateCounts(item.label)}
        />
      ))}
    </ul>
  )

  return (
    <div className="expaned-header" style={{ minHeight: '720px' }}>
      <div className="container">
        <div className="grid grid-between">
          <div className="col expaned-h-left">
            {frontPage.pageDescription}
            <div className="header-aggregate">{aggregateCounts(null)}</div>
            <div className="header-modality-wrap">{renderFacetSelect()}</div>
            <span className="header-or-text">Or</span>
            <div className="header-input-wrap">
              <div className="header-input">{renderSearchInput()}</div>

              <div className="header-input-button">
                <Button
                  onClick={() => onSearch()}
                  primary={true}
                  icon="fas fa-search"
                  size="large"
                  iconOnly={true}
                  label="Search"
                />
              </div>
            </div>

            {!user ? (
              <div className="grid  grid-start hero-signin">
                <div className=" hero-sigin-label">
                  <h3>SIGN IN</h3>
                </div>
                <div>
                  <a href={loginUrls.google}>
                    <Button
                      label="Google"
                      color="#fff"
                      icon="fab fa-google"
                      iconSize="23px"
                    />
                  </a>
                </div>
                <div>
                  <a href={loginUrls.orcid}>
                    <Button
                      label="ORCID"
                      color="#fff"
                      imgSrc={orcidIcon}
                      iconSize="23px"
                    />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
          {hexGrid}
        </div>
      </div>
    </div>
  )
}
