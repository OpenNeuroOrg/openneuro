import React from 'react'

import { ActivitySlider } from '../activity-slider/ActivitySlider'
import { Icon } from '../icon/Icon'
import activityIcon from '../assets/activity-icon.png'

import {
  RecentData,
  TopViewed,
} from '../mock-content/activity-slider-content.jsx'

export interface ContributersProps {}

export const ActivitySliderFront: React.FC<ContributersProps> = ({}) => {
  const recentSlider = {
    data: RecentData.data.datasets.edges,
    sliderClass: 'recent-slider',
    slideHeader: 'Newly Added',
    dots: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 989,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  const popularSlider = {
    data: TopViewed.data.datasets.edges,
    sliderClass: 'popular-slider',
    slideHeader: 'Most Viewed',
    dots: true,
    draggable: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 989,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <>
      <h2>
        <Icon label="Activity" imgSrc={activityIcon} iconSize="40px" />
      </h2>
      <ActivitySlider {...popularSlider} />
      <ActivitySlider {...recentSlider} />
    </>
  )
}
