import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import './slider.scss'

export interface ActivitySliderProps {
  className?: string
  sliderArgs: {
    showDots?: boolean
    infinite?: boolean
    keyBoardControl?: boolean
    containerClass?: string
    itemClass?: string
  }
  responsive: {
    superLargeDesktop?: {
      // the naming can be any, depends on you.
      breakpoint?: { max?: number; min?: number }
      items?: number
    }
    desktop?: {
      breakpoint?: { max?: number; min?: number }
      items?: number
    }
    tablet?: {
      breakpoint?: { max?: number; min?: number }
      items?: number
    }
    mobile?: {
      breakpoint?: { max?: number; min?: number }
      items?: number
    }
  }
  data: {
    id: string
    analytics: {
      views: number
    }
    latestSnapshot: {
      tag: string
      description: {
        Name: string
      }
      summary: {
        modalities: string[]
      }
    }
  }[]
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  className,
  data,
  slideHeader,
  sliderArgs,
  responsive,
}) => {
  console.log(data)
  return (
    <div className={'activity-slider' + ' ' + className}>
      <h3>{slideHeader}</h3>
      <Carousel {...sliderArgs} responsive={responsive}>
        {data.map(({ node }) => (
          <div className="activity-slider-node" key={node.id}>
            <div className="ds-name">
              <h4>
                <Link
                  to={
                    'datasets/' +
                    node.id +
                    '/versions/' +
                    node.latestSnapshot.tag
                  }>
                  {node.latestSnapshot.description.Name}
                </Link>
              </h4>
            </div>

            {node.publishDate ? (
              <div className="ds-pub-date">
                {formatDistanceToNow(parseISO(node.publishDate))} ago
              </div>
            ) : null}

            {node.analytics ? (
              <div className="ds-pub-views">
                {node.analytics.views.toLocaleString()} views
              </div>
            ) : null}

            <div className="ds-modality">
              <div className="hexagon-wrapper">
                {node.latestSnapshot.summary !== null ? (
                  <>
                    <div
                      className={
                        'hexagon ' +
                        node.latestSnapshot.summary.modalities[0].substr(0, 4)
                      }></div>
                    <div className="label">
                      {node.latestSnapshot.summary.modalities[0].substr(0, 4)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hexagon no-modality"></div>
                    <div className="label">N/A</div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
