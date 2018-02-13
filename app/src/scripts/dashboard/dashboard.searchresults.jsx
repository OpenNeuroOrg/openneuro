import React from 'react'
import Reflux from 'reflux'
import 'url-search-params-polyfill'
import { Link } from 'react-router-dom'
import request from '../utils/request'
import search from '../common/partials/search.jsx'

class SearchResults extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      results: null,
    }
  }

  componentDidMount() {
    let searchParams = new URLSearchParams(this.props.location.search)
    let key = 'AIzaSyB68V4zjGxWpZzTn8-vRuogiRLPmSCmWoo'
    let cx = '016952313242172063987:retmkn_owto'
    let q = searchParams.get('q')
    if (q) {
      request
        .get('https://www.googleapis.com/customsearch/v1', {
          query: { key: key, cx: cx, q: q },
        })
        .then(res => this.setState({ results: res }))
    }
  }

  render() {
    let renderedResults = this._results(this.state.results)
    return (
      <div className="route-wrapper">
        <div className="fade-in inner-route clearfix">
          <div className="dashboard-dataset-teasers datasets datasets-private">
            <div className="header-wrap clearfix">
              <div className="row">
                <div className="col-md-5">
                  <h2>Search Results</h2>
                </div>
                <div className="col-md-7">{search()}</div>
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
    } else if (results.statusCode != 200) {
      parsedResults = noResults
    } else {
      parsedResults = JSON.parse(results.text)
      if (parsedResults.searchInformation.totalResults < 1) {
        parsedResults = noResults
      }
    }

    return parsedResults.items.map(result => {
      let url = result.link
      let description = result.snippet
      return (
        <div className="fade-in  panel panel-default">
          <div className="panel-heading">
            <div className="header clearfix">
              <Link to={url}>
                <h4 className="dataset-name">{url}</h4>
                <div className="meta-container">
                  <p className="date">
                    <span className="name">{description}</span>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )
    })
  }
}

export default SearchResults
