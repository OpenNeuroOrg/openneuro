import React from 'react'

import { ActivitySlider } from '../activity-slider/ActivitySlider'
import { Icon } from '../icon/Icon'

import { RecentData, TopViewed } from '../content/activity-slider-content.jsx'

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
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 580,
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
    slideHeader: 'Popular Datasets',
    dots: true,
    draggable: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 580,
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
        <Icon label="Activity" icon="fab fa-google" />
      </h2>
      <ActivitySlider {...recentSlider} />
      <ActivitySlider {...popularSlider} />
    </>
  )
}
