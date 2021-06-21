import React from 'react'
import { FrontPage } from './FrontPage'
import { AffiliateBlock } from './AffiliateBlock'
import { ActivitySlider } from '../activity-slider/ActivitySlider'
import { Contributors } from './Contributors'
import { GetUpdates } from './GetUpdates'
import { Infographic } from './Infographic'
import { ActivityHeader } from './ActivityHeader'

import {
  RecentData,
  TopViewed,
} from '../mock-content/activity-slider-content.jsx'

export interface FrontPageContainerExampleProps {}

export const FrontPageContainerExample =
  ({}: FrontPageContainerExampleProps) => {
    //TopViewed.data.datasets.edges,
    // const sliderArgs = {
    //   dots: true,
    //   slidesToShow: 3,
    //   slidesToScroll: 3,
    //   swipeToSlide: false,
    //   swipe: true,
    //   infinite: true,
    //   containerClass: 'activity-slider',
    //   responsive: [
    //     {
    //       breakpoint: 800,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2,
    //       },
    //     },
    //     {
    //       breakpoint: 580,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //       },
    //     },
    //   ],
    // }
    return (
      <div>
        <FrontPage
          renderAffiliateBlock={() => <AffiliateBlock />}
          renderInfographic={() => <Infographic />}
          renderActivitySliderFront={() => (
            <>
              <h2>
                <ActivityHeader />
              </h2>
              <ActivitySlider
                data={RecentData.data.datasets.edges}
                sliderArgs={sliderArgs}
                className="recent-slider"
                slideHeader="Newly Added"
              />
              <ActivitySlider
                data={TopViewed.data.datasets.edges}
                sliderArgs={sliderArgs}
                className="popular-slider"
                slideHeader="Most Viewed"
              />
            </>
          )}
          renderGetUpdates={() => <GetUpdates />}
          renderContributors={() => <Contributors />}
        />
      </div>
    )
  }
