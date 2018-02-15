import React from 'react'
import Input from '../forms/input.jsx'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      query: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ query: event.target.value })
  }

  handleSubmit() {
    this.props.history
      .push({
        pathname: '/search/',
        search: '?q=' + encodeURIComponent(this.state.query),
      })
      .then(this.setState({ query: '' }))
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
            value={this.state.query}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
          <div className="form-group float-label-input">
            <button className="btn-blue" onClick={this.handleSubmit}>
              <span className="">
                <i className="fa fa-search" />
              </span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(Search)
