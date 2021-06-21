import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import Slider from 'react-slick'

// Import css files
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './slider.scss'

export interface ActivitySliderProps {
  className?: string
  sliderArgs: {
    dots?: boolean
    responsive?: object
    slidesToShow?: number
    slidesToScroll?: number
    swipeToSlide?: boolean
    slideHeader?: string
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
}) => {
  const datasets = data
  console.log(data)
  return (
    <div className={'activity-slider' + ' ' + className}>
      <h3>{slideHeader}</h3>
      <Slider {...sliderArgs}>
        {data.map(({ node, index }) => (
          <>
            <a
              href={
                'datasets/' + node.id + '/versions/' + node.latestSnapshot.tag
              }>
              <div className="activity-slider-node" key={index}>
                <div className="ds-name">
                  <h4>{node.latestSnapshot.description.Name}</h4>
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
                            node.latestSnapshot.summary.modalities[0].substr(
                              0,
                              4,
                            )
                          }></div>
                        <div className="label">
                          {node.latestSnapshot.summary.modalities[0].substr(
                            0,
                            4,
                          )}
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
            </a>
          </>
        ))}
      </Slider>
    </div>
  )
}
