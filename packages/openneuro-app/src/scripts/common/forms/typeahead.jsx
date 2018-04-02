// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup ----------------------------------------------------

let clickListener

export default class Typeahead extends React.Component {
  constructor() {
    super()
    this.state = {
      results: [],
    }
  }

  componentDidMount() {
    clickListener = this._onDocumentClick.bind(this)
    window.addEventListener('mousedown', clickListener)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', clickListener)
  }

  // life cycle events --------------------------------------------------

  render() {
    let results = this.state.results.map(result => {
      return (
        <li key={result} onClick={this._select.bind(this, result)}>
          {result}
        </li>
      )
    })

    return (
      <div
        className="typeahead"
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}>
        <input
          onChange={this._handleInput.bind(this)}
          value={this.props.value}
        />
        <ul className="typeahead-results">{results}</ul>
      </div>
    )
  }

  // custon methods -----------------------------------------------------

  _handleInput(e) {
    let value = e.target.value
    let options = this.props.options
    let results = []
    for (let option of options) {
      if (this.props.filter(option, value)) {
        let result = this._format(option, this.props.format)
        results.push(result)
      }
    }
    this.props.onChange(value)
    this.setState({ results })
  }

  _select(result, e) {
    e.stopPropagation()
    this.props.onChange(result)
    this.setState({ results: [] })
  }

  _format(obj, propString) {
    if (!propString) {
      return obj
    }
    let props = propString.split('.')
    for (let prop of props) {
      let candidate = obj[prop]
      if (candidate !== undefined) {
        obj = candidate
      } else {
        break
      }
    }
    return obj
  }

  _onDocumentClick() {
    if (!this.insideClick) {
      this.setState({ results: [] })
    }
  }

  onMouseDown() {
    this.insideClick = true
  }

  onMouseUp() {
    this.insideClick = false
  }
}

Typeahead.propTypes = {
  value: PropTypes.array,
  options: PropTypes.array,
  filter: PropTypes.array,
  formate: PropTypes.array,
  onChange: PropTypes.func,
  format: PropTypes.array,
}
