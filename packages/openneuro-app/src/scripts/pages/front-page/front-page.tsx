import React from "react"
import * as Sentry from "@sentry/react"
import { gql, useQuery } from "@apollo/client"
import { Mutation } from "@apollo/client/react/components"
import styled from "@emotion/styled"

import {
  ActivityHeader,
  AffiliateBlock,
  Contributors,
  GetUpdates,
  Infographic,
} from "@openneuro/components/front-page"
import { Loading } from "@openneuro/components/loading"
import { ActivitySlider } from "@openneuro/components/activity-slider"

const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`

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
              primaryModality
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
              primaryModality
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
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
}

export const FrontPageTopQuery = ({ query }) => {
  const result = useQuery(query, {
    errorPolicy: "all",
  })
  if (result.loading) {
    return (
      <>
        <Loading />
        <br />
      </>
    )
  } else if (result.error || result.data.datasets == null) {
    if (result?.error) {
      Sentry.captureException(result?.error)
    }
    return <div>Failed to load top datasets, please try again later.</div>
  } else {
    // Remove any edges which could not be loaded
    const edges = result.data.datasets.edges.filter((dataset) =>
      dataset !== null
    )
    return (
      <ActivitySlider
        data={edges}
        slideHeader="Most Viewed"
        showDots
        keyBoardControl
        containerClass="activity-slider recent-slider"
        itemClass="carousel-item"
        responsive={responsive}
      />
    )
  }
}

export const FrontPageNewQuery = ({ query }) => {
  const result = useQuery(query, {
    errorPolicy: "all",
  })
  if (result.loading) {
    return <Loading />
  } else if (result.error || result.data.datasets == null) {
    if (result?.error) {
      Sentry.captureException(result?.error)
    }
    return <div>Failed to load top datasets, please try again later.</div>
  } else {
    // Remove any edges which could not be loaded
    const edges = result.data.datasets.edges.filter((dataset) =>
      dataset !== null
    )
    return (
      <ActivitySlider
        data={edges}
        slideHeader="Recently Published"
        showDots
        keyBoardControl
        containerClass="activity-slider recent-slider"
        itemClass="carousel-item"
        responsive={responsive}
      />
    )
  }
}

const FrontPageSection = styled.section`
  margin: 100px 0;
  &:last-child {
    margin-bottom: 0;
  }
  &.gray-bg {
    margin: 0;
    padding: 100px 0;
    &:last-child {
      padding-bottom: 0;
    }
  }
`

const FrontPageContainer: React.FC = () => (
  <div className="front-page page">
    <FrontPageSection>
      <AffiliateBlock />
    </FrontPageSection>
    <FrontPageSection>
      <div className="container">
        <Infographic />
      </div>
    </FrontPageSection>
    <FrontPageSection className="front-page-activity">
      <div className="activity-swoop">
        <div></div>
      </div>
      <div className="swoop-content gray-bg">
        <div className="container">
          <ActivityHeader />
          <FrontPageTopQuery query={TOP_VIEWED} />
          <FrontPageNewQuery query={RECENTLY_PUBLISHED} />
        </div>
      </div>
    </FrontPageSection>
    <FrontPageSection className="gray-bg">
      <Mutation mutation={SUBSCRIBE_TO_NEWSLETTER}>
        {(subscribeToNewsletter) => (
          <GetUpdates
            subscribe={(email, cb) => {
              subscribeToNewsletter({ variables: { email } }).then(cb).catch(cb)
            }}
          />
        )}
      </Mutation>
    </FrontPageSection>
    <FrontPageSection className="gray-bg">
      <Contributors />
    </FrontPageSection>
  </div>
)

export default FrontPageContainer
