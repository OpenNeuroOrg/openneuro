import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import Spinner from '../common/partials/spinner.jsx'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import styled from '@emotion/styled'
import Uppercase from '../styles/uppercase.jsx'

const FontWeight600 = styled.span`
  font-weight: 600;
`

const WhiteText = styled.div`
  color: #fff;
  font-size: 20px;
  a {
    color: #fff;
    bottom-border: 1px dashed var(--tertiary);
  }
  a:hover {
    color: #eee;
  }
`

const PaddedRow = styled.div`
  padding-bottom: 1em;
`

const TOP_VIEWED = gql`
  query top_viewed_datasets {
    datasets(
      first: 5
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
      first: 5
      orderBy: { publishDate: ascending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          datePublished
          latestSnapshot {
            tag
            description {
              Name
            }
          }
        }
      }
    }
  }
`

const DatasetLink = ({ node }) => {
  return (
    <Link to={`/datasets/${node.id}/versions/${node.latestSnapshot.tag}`}>
      {node.latestSnapshot.description.Name}
    </Link>
  )
}

DatasetLink.propTypes = {
  node: PropTypes.object,
}

const FrontPageTopActive = ({ datasets }) => {
  return (
    <>
      {datasets.map(({ node }, index) => (
        <PaddedRow className="row" key={index}>
          <div className="col-sm-2">
            <FontWeight600>
              <i className="fa fa-eye" />{' '}
              {node.analytics.views.toLocaleString()}
            </FontWeight600>
          </div>
          <div className="col-sm-10">
            <DatasetLink node={node} />
          </div>
        </PaddedRow>
      ))}
      <PaddedRow className="row">
        <div className="col-sm-2"> </div>
        <div className="col-sm-10">
          <Link to="/public/datasets">View More...</Link>
        </div>
      </PaddedRow>
    </>
  )
}

const FrontPageTopRecent = ({ datasets }) => {
  return (
    <>
      {datasets.reverse().map(({ node }, index) => (
        <PaddedRow className="row" key={index}>
          <div className="col-sm-8">
            <DatasetLink node={node} />
          </div>
          <div className="col-sm-4">
            <FontWeight600>
              <Uppercase>
                {distanceInWordsToNow(node.datePublished)} ago
              </Uppercase>
            </FontWeight600>
          </div>
        </PaddedRow>
      ))}
    </>
  )
}

const FrontPageTopResult = query => ({ loading, error, data }) => {
  if (error) {
    Sentry.captureException(error)
    return <div>Failed to load top datasets, please try again later.</div>
  } else if (loading) {
    return <Spinner active />
  } else {
    if (query === TOP_VIEWED) {
      return <FrontPageTopActive datasets={data.datasets.edges} />
    } else if (query === RECENTLY_PUBLISHED) {
      return <FrontPageTopRecent datasets={data.datasets.edges} />
    }
  }
}

const FrontPageTopQuery = ({ query }) => (
  <Query query={query}>{FrontPageTopResult(query)}</Query>
)

FrontPageTopQuery.propTypes = {
  query: PropTypes.object,
}

const FrontPageTopDatasets = () => (
  <>
    <div className="browse-pipelines">
      <h3 className="browse-pipeline-header">Recent Activity</h3>
      <div className="container">
        <div className="row">
          <WhiteText>
            <div className="col-sm-6 mate-slide fade-in">
              <h4>Most Active</h4>
              <FrontPageTopQuery query={TOP_VIEWED} />
            </div>
            <div className="col-sm-6 mate-slide fade-in browse">
              <h4>Recently Published</h4>
              <FrontPageTopQuery query={RECENTLY_PUBLISHED} />
            </div>
          </WhiteText>
        </div>
      </div>
    </div>
  </>
)

export default FrontPageTopDatasets
