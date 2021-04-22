import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import Slider from 'react-slick'

// Import css files
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './slider.scss'

export interface ActivitySliderProps {
  sliderClass?: string
  dots?: boolean
  responsive?: object
  slidesToShow?: number
  slidesToScroll?: number
  swipeToSlide?: boolean
  slideHeader?: string
  data: Record<string, any>
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  slideHeader,
  sliderClass,
  data,
  accessibility = true,
  draggable = true,
  ...props
}) => {
  const datasets = data.datasets.edges
  return (
    <div className={'container activity-slider' + ' ' + sliderClass}>
      <h3>{slideHeader}</h3>
      <Slider {...props}>
        {datasets.map((item, index) => (
          <>
            <a
              href={
                'datasets/' +
                item.node.id +
                '/versions/' +
                item.node.latestSnapshot.tag
              }>
              <div className="activity-slider-node" key={index}>
                <div className="ds-name">
                  <h4>{item.node.latestSnapshot.description.Name}</h4>
                </div>

                {item.node.publishDate ? (
                  <div className="ds-pub-date">
                    {formatDistanceToNow(parseISO(item.node.publishDate))} ago
                  </div>
                ) : null}

                {item.node.analytics ? (
                  <div className="ds-pub-views">
                    {item.node.analytics.views.toLocaleString()} views
                  </div>
                ) : null}

                <div className="ds-modality">
                  <div className="hexagon-wrapper">
                    {item.node.latestSnapshot.summary !== null ? (
                      <>
                        <div
                          className={
                            'hexagon ' +
                            item.node.latestSnapshot.summary.modalities[0].substr(
                              0,
                              4,
                            )
                          }></div>
                        <div className="label">
                          {item.node.latestSnapshot.summary.modalities[0].substr(
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
