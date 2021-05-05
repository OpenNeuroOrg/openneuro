import React, { useEffect, useRef } from 'react'

import { Button } from '../button/Button'
import { ModalityCube } from '../modality-cube/ModalityCube'
import { cubeData } from '../mock-content/modality-cube-content.jsx'
import orcidIcon from '../assets/orcid_24x24.png'

import { frontPage } from '../mock-content/front-page-content.jsx'

export interface LandingExpandedHeaderProps {
  user?: {}
}

export const LandingExpandedHeader: React.FC<LandingExpandedHeaderProps> = ({
  user,
}) => {
  const cubeWrap = (
    <div className="cube-wrap col col-6" id="front-cubes">
      {cubeData.map((item, index) => (
        <div className="cube-block ">
          <ModalityCube
            key={index}
            label={item.label}
            backgroundColor={item.backgroundColor}
            cubeImage={item.cubeImage}
            stats={item.stats}
          />
        </div>
      ))}
    </div>
  )
  return (
    <div className="expaned-header" style={{ minHeight: '720px' }}>
      <div className="container">
        <div className="grid grid-between">
          <div className="col col-6 expaned-h-left">
            {frontPage.pageDescription}
            {!user ? (
              <div className="grid  grid-start hero-signin">
                <div className=" hero-sigin-label">
                  <h4>SIGN IN</h4>
                </div>
                <div>
                  <Button
                    label="Google"
                    color="#fff"
                    icon="fab fa-google"
                    iconSize="23px"
                  />
                </div>
                <div>
                  <Button
                    label="ORCID"
                    color="#fff"
                    imgSrc={orcidIcon}
                    iconSize="23px"
                  />
                </div>
              </div>
            ) : null}
          </div>
          {cubeWrap}
        </div>
      </div>
    </div>
  )
}
