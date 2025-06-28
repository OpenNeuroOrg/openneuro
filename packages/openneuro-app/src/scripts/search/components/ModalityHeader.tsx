import React from "react"
import type { ReactNode } from "react"

export interface ModalityHeaderProps {
  portalName: string
  pageBrand?: string
  portalPrimary: string | ReactNode
  hexBackgroundImage: string
  renderAggregateCounts: () => ReactNode
}

export const ModalityHeader = ({
  portalName,
  portalPrimary,
  hexBackgroundImage,
  pageBrand,
  renderAggregateCounts,
}: ModalityHeaderProps) => {
  return (
    <section className="search-page-portal-header">
      <div className="container">
        <div className="grid grid-nogutter">
          <div className="col col-7 portal-primary">
            <h1>{portalName}</h1>
            <div className="primary-content">{portalPrimary}</div>
            <div className="secondary-content">{renderAggregateCounts()}</div>
          </div>
          {pageBrand
            ? (
              <div className="col col-3">
                <img
                  src={pageBrand}
                  alt={portalName}
                  style={{
                    margin: "30px 0 30px 50px",
                    maxWidth: "380px",
                    height: "auto",
                  }}
                />
              </div>
            )
            : (
              <div className="col col-3 hex-col">
                <div
                  className="search-hexagon"
                  style={{
                    backgroundImage: `url(${hexBackgroundImage})`,
                  }}
                >
                  <div className="hexTop"></div>
                  <div className="hexBottom"></div>
                </div>
                <div className="search-shade-cube">
                  <div className="front"></div>
                  <div className="top"></div>
                  <div className="right"></div>
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  )
}
