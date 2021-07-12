import React, { ReactNode } from 'react'

export interface ModalityHeaderProps {
  portalName: string
  portalPrimary: string | ReactNode
  publicDatasetStat: number
  participantsStat: number
  hexBackgroundImage: string
  renderAggregateCounts: () => ReactNode
}

export const ModalityHeader = ({
  portalName,
  portalPrimary,
  publicDatasetStat,
  participantsStat,
  hexBackgroundImage,
  renderAggregateCounts,
}: ModalityHeaderProps) => {
  return (
    <section className="search-page-portal-header">
      <div className="container">
        <div className="grid grid-nogutter">
          <div className="col col-7 ">
            <h1>{portalName}</h1>
            <div className="primary-content">{portalPrimary}</div>
            <div className="secondary-content">{renderAggregateCounts()}</div>
          </div>
          <div className="col col-3 hex-col">
            <div
              className="search-hexagon"
              style={{
                backgroundImage: `url(${hexBackgroundImage})`,
              }}>
              <div className="hexTop"></div>
              <div className="hexBottom"></div>
            </div>
            <div className="search-shade-cube">
              <div className="front"></div>
              <div className="top"></div>
              <div className="right"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
