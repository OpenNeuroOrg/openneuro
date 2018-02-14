import React from 'react'
import Input from '../common/forms/input.jsx'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      query: '/search',
    }
  }

  updateLink(e) {
    this.setState({ query: '/search/' + e.target.value })
  }

  render() {
    return (
      <div className="search-group">
        <form className="form-inline">
          <Input
            placeholder="Search Datasets"
            type="text"
            className="search-field"
            name="q"
            onChange={e => this.updateLink(e)}
          />
          <div className="form-group float-label-input">
            <Link to={this.state.query}>
              <button className="btn-blue" type="submit">
                <span className="">
                  <i className="fa fa-search" />
                </span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(Search)
