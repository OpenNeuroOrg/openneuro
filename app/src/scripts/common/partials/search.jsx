import React from 'react'
import Input from '../forms/input.jsx'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

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

  handleSubmit(event) {
    event.preventDefault()
    this.props.history.push({
      pathname: `/search/${encodeURIComponent(this.state.query)}`,
    })
    this.setState({ query: '' })
    // Because this is called from a form
    return false
  }

  render() {
    return (
      <div className="search-group">
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <Input
            placeholder="Search Datasets"
            type="text"
            className="search-field"
            name="q"
            value={this.state.query}
            onChange={this.handleChange}
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

Search.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withRouter(Search)
