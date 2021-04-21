import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import Slider from 'react-slick'

// Import css files
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './slider.scss'

export interface ActivitySliderProps {
  accessibility?: boolean
  arrows?: boolean
  autoplaySpeed?: number
  autoplay?: boolean
  sliderClass?: string
  dots?: boolean
  draggable?: boolean
  infinite?: boolean
  speed?: number
  slidesToShow?: number
  slidesToScroll?: number
  swipeToSlide?: boolean
  slideHeader?: string
  data: object
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  data,
  slideHeader,
  sliderClass,
  ...props
}) => {
  const datasets = data.data.datasets.edges
  console.log(datasets)
  return (
    <div className={'container activity-slider' + ' ' + sliderClass}>
      <h2>{slideHeader}</h2>
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
                  {item.node.latestSnapshot.description.Name}
                </div>
                <div className="ds-pub-date">
                  {formatDistanceToNow(parseISO(item.node.publishDate))} ago
                </div>

                <div className="ds-modality">
                  {item.node.latestSnapshot.summary !== null
                    ? item.node.latestSnapshot.summary.modalities[0]
                    : 'n/a'}
                </div>
              </div>
            </a>
          </>
        ))}
      </Slider>
    </div>
  )
}
