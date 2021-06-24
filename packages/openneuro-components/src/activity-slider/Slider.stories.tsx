import React from 'react'
import { Story, Meta } from '@storybook/react'

import { ActivitySlider, ActivitySliderProps } from './ActivitySlider'

import {
  RecentData,
  TopViewed,
} from '../mock-content/activity-slider-content.jsx'

export default {
  title: 'Components/Sliders',
  component: ActivitySlider,
} as Meta

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    slidesToSlide: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
}
const Template: Story<ActivitySliderProps> = args => (
  <ActivitySlider {...args} responsive={responsive} />
)

export const RecentDatasets = Template.bind({})
RecentDatasets.args = {
  data: RecentData.data.datasets.edges,
  showDots: true,
  infinite: true,
  keyBoardControl: true,
  containerClass: 'activity-slider',
  itemClass: 'carousel-item',
}

export const PopularDatasets = Template.bind({})
PopularDatasets.args = {
  data: TopViewed.data.datasets.edges,
  showDots: true,
  infinite: true,
  keyBoardControl: true,
  containerClass: 'carousel-container',
  itemClass: 'carousel-item',
}
