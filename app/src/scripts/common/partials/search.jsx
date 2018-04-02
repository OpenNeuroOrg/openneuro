import React from 'react'
import Input from '../forms/input.jsx'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      query: '',
      error: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ query: event.target.value, error: false })
  }

  handleSubmit(event) {
    let query = this.state.query
    event.preventDefault()
    if (query != '') {
      this.props.history.push({
        pathname: `/search/${encodeURIComponent(this.state.query)}`,
      })
      this.setState({ query: '', error: false })
      // Because this is called from a form
      return false
    } else {
      this.setState({ error: true })
      return false
    }
  }

  render() {
    let checkClass = this.state.error ? 'search-field error' : 'search-field'
    return (
      <div className="search-group">
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <Input
            placeholder="Search Datasets"
            type="text"
            className={checkClass}
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
          {this.state.error && !this.state.query ? (
            <div className="text-danger">
              Please enter a valid search parameter
            </div>
          ) : null}
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
