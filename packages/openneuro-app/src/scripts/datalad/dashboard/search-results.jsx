import React from 'react'
import PropTypes from 'prop-types'
import 'url-search-params-polyfill'
import { Link } from 'react-router-dom'
import request from '../../utils/request'
import Spinner from '../../common/partials/spinner.jsx'
import Search from '../../common/partials/search.jsx'
import { withRouter } from 'react-router'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'
import { pageTitle } from '../../resources/strings.js'

const QuerySpreadsheetNoticeContainer = styled.section({
  marginTop: '1rem',
  borderTop: '1px solid #e1e1e1',
  padding: '1rem 2rem',
})

class SearchResults extends React.Component {
  constructor() {
    super()
    this.state = {
      results: null,
      query: null,
      loading: true,
    }
    this._requestSearch = this._requestSearch.bind(this)
  }

  // Life Cycle Methods ------------------------------------------------

  componentWillReceiveProps(nextProps) {
    // Search again if the query changes
    if (nextProps.match.params.query !== this.props.match.params.query) {
      this._requestSearch(nextProps.match.params.query)
    }
  }

  componentDidMount() {
    if (!this.state.results) {
      this._requestSearch(this.props.match.params.query)
    }
  }

  render() {
    let query = this.props.match.params.query || this.state.query
    return (
      <>
        <Helmet>
          <title>
            {query} - {pageTitle} Search
          </title>
        </Helmet>
        <div className="route-wrapper">
          <div className="fade-in inner-route clearfix">
            <div className="dashboard-dataset-teasers datasets datasets-private">
              <div className="admin clearfix">
                <div className="row">
                  <div className="col-md-5">
                    {query &&
                    this.state.results &&
                    this.state.results[0].link != 'No results' ? (
                      <React.Fragment>
                        <h2>Search Results</h2>
                        <span className="sub-title">
                          showing {this.state.results.length} results for:{' '}
                          {query}
                        </span>
                      </React.Fragment>
                    ) : null}
                  </div>
                  <div className="col-md-7">
                    <Search />
                  </div>
                </div>
                <QuerySpreadsheetNoticeContainer className="filters-sort-wrap">
                  {
                    "Not finding what you're looking for? See additional metadata "
                  }
                  <a href="https://docs.google.com/spreadsheets/d/1rsVlKg0vBzkx7XUGK4joky9cM8umtkQRpJ2Y-5d6x7c/edit#gid=1226202843">
                    here
                  </a>
                  .
                </QuerySpreadsheetNoticeContainer>
                {this.state.loading ? (
                  <Spinner active={true} />
                ) : (
                  this._checkLoadingStatus(this.state.results, this.state.query)
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  // Custom Methods ------------------------------------------------

  _requestSearch(query) {
    this.setState({
      loading: true,
    })

    const key = 'AIzaSyB68V4zjGxWpZzTn8-vRuogiRLPmSCmWoo'
    const cx = '016952313242172063987:retmkn_owto'
    if (query) {
      request
        .get('https://www.googleapis.com/customsearch/v1', {
          query: { key: key, cx: cx, q: query },
        })
        .then(response => {
          let parsedResponse
          let noResults = [{ link: 'No results', snippet: '' }]
          let searchResults = {}
          if (!response || !response.text || !response.links) {
            searchResults = noResults
          } else {
            parsedResponse = JSON.parse(response.text)
            if (parsedResponse.searchInformation.totalResults < 1) {
              searchResults = noResults
            } else {
              searchResults = parsedResponse.items
            }
          }
          this.setState({
            results: searchResults,
            query: query,
            loading: false,
          })
        })
        .catch(() => {
          let failedResponse = [
            {
              link: 'https://www.google.com/search?q=' + query,
              snippet:
                'Failed to load search results, please try using Google directly.',
            },
          ]
          this.setState({
            results: failedResponse,
            query: query,
            loading: false,
          })
        })
    } else {
      this.setState({
        results: '',
        query: '',
        loading: false,
      })
    }
  }

  // Templating Methods ------------------------------------------------

  _checkLoadingStatus(results, query) {
    if (!query) {
      return (
        <h4>
          No results found. Please check the url for accuracy and try again.
        </h4>
      )
    } else if (results.length) {
      return <div className="panel-group">{this._results(results)}</div>
    }
  }

  _results(results) {
    if (results[0].link === 'No results') {
      return (
        <h4>
          No results found for {this.state.query}. If you found this page in
          error, please try your search again.
        </h4>
      )
    } else {
      return results.map((result, index) => {
        let resultLink = this._resultLink(result)
        return (
          <div key={index} className="fade-in  panel panel-default">
            <div className="panel-body">
              <div className="panel-heading">
                <div className="header clearfix">{resultLink}</div>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  _resultLink(result) {
    let innerContent = (
      <div className="meta-container">
        <h4 className="dataset-name">{result.title}</h4>
        <p className="date">
          <span className="name">{result.snippet}</span>
        </p>
      </div>
    )

    let parsedUrl = new URLSearchParams(result.link)
    const hostname = parsedUrl.get('hostname')
    if (hostname === window.location.hostname) {
      return <Link to={parsedUrl.get('pathname')}>{innerContent}</Link>
    } else {
      return <a href={result.link}>{innerContent}</a>
    }
  }
}

SearchResults.propTypes = {
  match: PropTypes.object,
}

export default withRouter(SearchResults)
