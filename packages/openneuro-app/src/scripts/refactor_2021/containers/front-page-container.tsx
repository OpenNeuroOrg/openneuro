import React from 'react'
import {
  FrontPage,
  AffiliateBlock,
  ActivitySlider,
  ActivityHeader,
  Contributors,
  GetUpdates,
  Infographic,
  RecentData,
  TopViewed,
} from '@openneuro/components'

import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'

const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`

const FrontPageContainer: React.FC = () => {
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
  return (
    <>
      <FrontPage
        className="front-page"
        renderAffiliateBlock={() => <AffiliateBlock />}
        renderInfographic={() => <Infographic />}
        renderActivitySliderFront={() => (
          <>
            <ActivityHeader />
            <ActivitySlider
              data={RecentData.data.datasets.edges}
              slideHeader="Newly Added"
              showDots={true}
              infinite={true}
              keyBoardControl={true}
              containerClass="activity-slider recent-slider"
              itemClass="carousel-item"
              responsive={responsive}
            />
            <ActivitySlider
              data={TopViewed.data.datasets.edges}
              slideHeader="Most Viewed"
              showDots={true}
              infinite={true}
              keyBoardControl={true}
              containerClass="activity-slider popular-slider"
              itemClass="carousel-item"
              responsive={responsive}
            />
          </>
        )}
        renderGetUpdates={() => (
          <Mutation mutation={SUBSCRIBE_TO_NEWSLETTER}>
            {subscribeToNewsletter => (
              <GetUpdates
                subscribe={(email, cb) => {
                  subscribeToNewsletter({ variables: { email } })
                    .then(cb)
                    .catch(cb)
                }}
              />
            )}
          </Mutation>
        )}
        renderContributors={() => <Contributors />}
      />
    </>
  )
}

export default FrontPageContainer
