import * as Sentry from '@sentry/browser'
import React from 'react'
import { gql, useQuery } from '@apollo/client'

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
  Loading,
} from '@openneuro/components'

const TOP_VIEWED = gql`
  query top_viewed_datasets {
    datasets(
      first: 12
      orderBy: { views: descending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          analytics {
            views
          }
          latestSnapshot {
            tag
            summary {
              modalities
            }
            description {
              Name
            }
          }
        }
      }
    }
  }
`

const RECENTLY_PUBLISHED = gql`
  query recently_published_datasets {
    datasets(
      first: 12
      orderBy: { publishDate: descending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          publishDate
          latestSnapshot {
            tag
            summary {
              modalities
            }
            description {
              Name
            }
          }
        }
      }
    }
  }
`

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
    slidesToSlide: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
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

export const FrontPageTopQuery = ({ query }) => {
  const result = useQuery(query)
  if (result.loading) {
    return (
      <>
        <Loading />
        <br />
      </>
    )
  } else if (result.error || result.data.datasets == null) {
    Sentry.captureException(result.error)
    return <div>Failed to load top datasets, please try again later.</div>
  } else {
    // Remove any edges which could not be loaded
    const edges = result.data.datasets.edges.filter(dataset => dataset !== null)
    return (
      <ActivitySlider
        data={edges}
        slideHeader="Most Viewed"
        showDots
        infinite
        keyBoardControl
        containerClass="activity-slider recent-slider"
        itemClass="carousel-item"
        responsive={responsive}
      />
    )
  }
}

export const FrontPageNewQuery = ({ query }) => {
  const result = useQuery(query)
  if (result.loading) {
    return <Loading />
  } else if (result.error || result.data.datasets == null) {
    Sentry.captureException(result.error)
    return <div>Failed to load top datasets, please try again later.</div>
  } else {
    // Remove any edges which could not be loaded
    const edges = result.data.datasets.edges.filter(dataset => dataset !== null)
    return (
      <ActivitySlider
        data={edges}
        slideHeader="Newly Added"
        showDots
        infinite
        keyBoardControl
        containerClass="activity-slider recent-slider"
        itemClass="carousel-item"
        responsive={responsive}
      />
    )
  }
}
const FrontPageContainer: React.FC = () => {
  return (
    <>
      <FrontPage
        className="front-page"
        renderAffiliateBlock={() => <AffiliateBlock />}
        renderInfographic={() => <Infographic />}
        renderActivitySliderFront={() => (
          <>
            <ActivityHeader />
            <FrontPageTopQuery query={TOP_VIEWED} />
            <FrontPageNewQuery query={RECENTLY_PUBLISHED} />
          </>
        )}
        renderGetUpdates={() => <GetUpdates />}
        renderContributors={() => <Contributors />}
      />
    </>
  )
}

export default FrontPageContainer
