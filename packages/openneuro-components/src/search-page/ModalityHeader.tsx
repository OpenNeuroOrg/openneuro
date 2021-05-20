import React from 'react'
import { AggregateCount } from '../aggregate-count/AggregateCount'

export interface ModalityHeaderProps {
  portalName: string
  portalPrimary: string
  publicDatasetStat: number
  participantsStat: number
  hexBackgroundImage: string
  swoopBackgroundColorLight: string
  swoopBackgroundColorDark: string
}

export const ModalityHeader = ({
  portalName,
  portalPrimary,
  publicDatasetStat,
  participantsStat,
  hexBackgroundImage,
  swoopBackgroundColorLight,
  swoopBackgroundColorDark,
}: ModalityHeaderProps) => {
  console.log(hexBackgroundImage)
  return (
    <section className="search-page-portal-header">
      <div className="container">
        <div className="grid grid-between">
          <div className="col ">
            <h1>{portalName}</h1>
            <div className="primary-content">{portalPrimary}</div>
            <div className="secondary-content">
              <AggregateCount count={publicDatasetStat} type="publicDataset" />
              <AggregateCount count={participantsStat} type="participants" />
            </div>
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
      <div className="swoop-wrap">
        <div
          className="search-swoop"
          style={{
            backgroundColor: swoopBackgroundColorLight,
            background: `linear-gradient(16deg, ${swoopBackgroundColorDark} 0%, ${swoopBackgroundColorLight} 70%)`,
          }}>
          <div></div>
        </div>
      </div>
    </section>
  )
}
