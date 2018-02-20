import React from 'react'
import 'url-search-params-polyfill'
import { Link } from 'react-router-dom'
import request from '../utils/request'
import Spinner from '../common/partials/spinner.jsx'
import Search from '../common/partials/search.jsx'
import { withRouter } from 'react-router'
import urlParse from 'url-parse'
import PropTypes from 'prop-types'

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
          if (!response || !response.text) {
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
        .catch(err => {
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
    }
  }

  render() {
    let renderedResults = this.state.loading ? (
      <Spinner active={true} />
    ) : (
      this._results(this.state.results)
    )
    return (
      <div className="route-wrapper">
        <div className="fade-in inner-route clearfix">
          <div className="dashboard-dataset-teasers datasets datasets-private">
            <div className="admin header-wrap clearfix">
              <div className="row">
                <div className="col-md-5">
                  <h2>Search Results</h2>
                </div>
                <div className="col-md-7">
                  <Search />
                </div>
              </div>
              {renderedResults}
            </div>
          </div>
        </div>
      </div>
    )
  }

  _results(results) {
    return results.map((result, index) => {
      let resultLink = this._resultLink(result)
      return (
        <div key={index} className="fade-in  panel panel-default">
          <div className="panel-heading">
            <div className="header clearfix">{resultLink}</div>
          </div>
        </div>
      )
    })
  }

  _resultLink(result) {
    let innerContent = (
      <div className="meta-container">
        <h4 className="dataset-name">{result.link}</h4>
        <p className="date">
          <span className="name">{result.snippet}</span>
        </p>
      </div>
    )
    let parsedUrl = urlParse(result.link, true)
    const hostname = parsedUrl.hostname
    if (hostname === window.location.hostname) {
      return <Link to={parsedUrl.pathname}>{innerContent}</Link>
    } else {
      return <a href={result.link}>{innerContent}</a>
    }
  }
}

SearchResults.propTypes = {
  match: PropTypes.object,
}

export default withRouter(SearchResults)
