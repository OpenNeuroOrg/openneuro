import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel/lib/Carousel'
import { ArrowProps, ResponsiveType } from 'react-multi-carousel/lib/types'
import 'react-multi-carousel/lib/styles.css'

export interface ActivitySliderProps {
  className?: string
  showDots?: boolean
  infinite?: boolean
  keyBoardControl?: boolean
  containerClass?: string
  itemClass?: string
  slideHeader?: React.ReactNode
  responsive: ResponsiveType
  data: Array<any>
}

const LeftArrow = ({ onClick }: ArrowProps) => (
  <i className="fas fa-chevron-left" onClick={() => onClick()} />
)

const RightArrow = ({ onClick }: ArrowProps) => (
  <i className="fas fa-chevron-right" onClick={() => onClick()} />
)

export const ActivitySlider = ({
  className,
  data,
  showDots,
  slideHeader,
  responsive,
  infinite,
  keyBoardControl,
  containerClass,
  itemClass,
}: ActivitySliderProps) => {
  return (
    <div className={'activity-slider' + ' ' + className}>
      <h3>{slideHeader}</h3>
      {/** @ts-expect-error wrong module export but works */}
      <Carousel
        infinite={infinite}
        keyBoardControl={keyBoardControl}
        containerClass={containerClass}
        itemClass={itemClass}
        showDots={showDots}
        responsive={responsive}
        customLeftArrow={<LeftArrow />}
        customRightArrow={<RightArrow />}
      >
        {data.map(({ node }) => (
          <div className="activity-slider-node" key={node.id}>
            <div className="ds-modality">
              <div className="hexagon-wrapper">
                {node.latestSnapshot.summary?.primaryModality ? (
                  <>
                    <div
                      className={
                        'hexagon ' +
                        node.latestSnapshot.summary?.primaryModality.toLowerCase()
                      }
                    ></div>
                    <div className="label">
                      {node.latestSnapshot.summary?.primaryModality}
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
            <div className="ds-name">
              <h4>
                <Link
                  to={
                    'datasets/' +
                    node.id +
                    '/versions/' +
                    node.latestSnapshot.tag
                  }
                >
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
          </div>
        ))}
      </Carousel>
    </div>
  )
}
