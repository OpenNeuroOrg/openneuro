import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ActivitySlider, ActivitySliderProps } from './ActivitySlider'

import { RecentData, TopViewed } from '../content/activity-slider-content.jsx'

export default {
  title: 'Components/Sliders',
  component: ActivitySlider,
} as Meta

const Template: Story<ActivitySliderProps> = args => (
  <ActivitySlider {...args} />
)

export const RecentDatasets = Template.bind({})
RecentDatasets.args = {
  data: RecentData.data.datasets.edges,
  slidersliderClass: 'recent-slider',
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

export const PopularDatasets = Template.bind({})
PopularDatasets.args = {
  data: TopViewed.data.datasets.edges,
  sliderClass: 'recent-slider',
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
