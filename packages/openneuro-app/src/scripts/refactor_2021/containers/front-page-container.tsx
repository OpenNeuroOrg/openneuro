import React from 'react'
import {
  FrontPage,
  AffiliateBlock,
  ActivitySlider,
  Contributors,
  GetUpdates,
  Infographic,
  Icon,
  RecentData,
  TopViewed,
} from '@openneuro/components'

const FrontPageContainer: React.FC = () => {
  const sliderArgs = {
    data: RecentData.data.datasets.edges,
    dots: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: false,
    swipe: true,
    infinite: true,
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
      <FrontPage
        className="front-page"
        renderAffiliateBlock={() => <AffiliateBlock />}
        renderInfographic={() => <Infographic />}
        renderActivitySliderFront={() => (
          <>
            {/* <h2>
                <Icon label="Activity" imgSrc={activityIcon} iconSize="40px" />
              </h2>*/}
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
    </>
  )
}

export default FrontPageContainer
