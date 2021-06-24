import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import './slider.scss'

export interface ActivitySliderProps {
  className?: string
  showDots?: boolean
  infinite?: boolean
  keyBoardControl?: boolean
  containerClass?: string
  itemClass?: string

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
const LeftArrow: React.FC = ({ onClick }) => (
  <i className="fas fa-chevron-left" onClick={() => onClick()} />
)

const RightArrow: React.FC = ({ onClick }) => (
  <i className="fas fa-chevron-right" onClick={() => onClick()} />
)

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  className,
  data,
  showDots,
  slideHeader,
  responsive,
  infinite,
  keyBoardControl,
  containerClass,
  itemClass,
}) => {
  return (
    <div className={'activity-slider' + ' ' + className}>
      <h3>{slideHeader}</h3>
      {/* @ts-expect-error */}
      <Carousel
        infinite={infinite}
        keyBoardControl={keyBoardControl}
        containerClass={containerClass}
        itemClass={itemClass}
        showDots={showDots}
        responsive={responsive}
        customLeftArrow={<LeftArrow />}
        customRightArrow={<RightArrow />}>
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
                    {/* TODO GET the primary modality when available */}
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
