import React from 'react'
import Reflux from 'reflux'
import 'url-search-params-polyfill'
import { Link } from 'react-router-dom'
import request from '../utils/request'
import Search from '../common/partials/search.jsx'
import { withRouter } from 'react-router'
import urlParse from 'url-parse'

class SearchResults extends React.Component {
  constructor() {
    super()
    this.state = {
      results: null,
      query: null,
    }
  }

  componentDidMount() {
    let searchParams = new URLSearchParams(this.props.location.search)
    let key = 'AIzaSyB68V4zjGxWpZzTn8-vRuogiRLPmSCmWoo'
    let cx = '016952313242172063987:retmkn_owto'
    let query = searchParams.get('q')
    if (query) {
      request
        .get('https://www.googleapis.com/customsearch/v1', {
          query: { key: key, cx: cx, q: query },
        })
        .then(res =>
          this.setState({
            results: res,
            query: query,
          }),
        )
    }
  }

  render() {
    let renderedResults = this._results(this.state.results)
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
    let parsedResults = {}
    let noResults = { items: [{ link: 'No results', snippet: '' }] }
    if (!results || !results.text) {
      parsedResults = noResults
    } else if (results.statusCode == 403) {
      parsedResults = {
        items: [
          {
            link: 'https://www.google.com/search?q=' + this.state.query,
            snippet:
              'Failed to load search results, please try using Google directly.',
          },
        ],
      }
    } else if (results.statusCode != 200) {
      parsedResults = noResults
    } else {
      parsedResults = JSON.parse(results.text)
      if (parsedResults.searchInformation.totalResults < 1) {
        parsedResults = noResults
      }
    }

    return parsedResults.items.map(result => {
      let resultLink = this._resultLink(result)
      return (
        <div className="fade-in  panel panel-default">
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

export default withRouter(SearchResults)
