import React from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../button/Button"
import { ModalityCube } from "../modality-cube/ModalityCube"
import { frontPage } from "../../common/content/front-page-content"
import { cubeData } from "../../common/content/modality-cube-content"
import orcidIcon from "../../../assets/orcid_24x24.png"
import { loginCheck } from "../../authentication/loginCheck"
import { useCookies } from "react-cookie"

import "./header.scss"

export interface LandingExpandedHeaderProps {
  loginUrls?: Record<string, string>
  renderAggregateCounts?: (modality?: string) => React.ReactNode
  renderFacetSelect: () => React.ReactNode
  renderSearchInput: () => React.ReactNode
  onSearch: () => void
}

export const LandingExpandedHeader: React.FC<LandingExpandedHeaderProps> = ({
  loginUrls,
  renderAggregateCounts,
  renderFacetSelect,
  renderSearchInput,
  onSearch,
}) => {
  const aggregateCounts = (modality: string): React.ReactNode =>
    renderAggregateCounts ? renderAggregateCounts(modality) : null
  const navigate = useNavigate()
  const [cookies] = useCookies()
  const hexGrid = (
    <ul id="hexGrid">
      {cubeData.map((item, index) => (
        <ModalityCube
          portal={item.portal}
          key={index}
          label={item.label}
          cubeImage={item.cubeImage}
          altText={item.altText}
          cubeFaceImage={item.cubeFaceImage}
          stats={aggregateCounts(item.label.toLowerCase())}
          onClick={(redirectPath) => (_err) => {
            navigate(redirectPath)
          }}
        />
      ))}
    </ul>
  )
  const isLoggedIn = loginCheck(cookies)

  return (
    <div className="expaned-header" style={{ minHeight: "720px" }}>
      <div className="container">
        <div className="grid grid-between header-wrap">
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
                  size="small"
                  iconOnly={true}
                  label="Search"
                />
              </div>
            </div>

            {!isLoggedIn
              ? (
                <div className="grid  grid-start hero-signin">
                  <div className=" hero-sigin-label">
                    <h3>SIGN IN</h3>
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
                </div>
              )
              : null}
          </div>
          {hexGrid}
        </div>
      </div>
    </div>
  )
}
