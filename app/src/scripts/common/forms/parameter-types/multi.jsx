import React from 'react'
import Input from '../input.jsx'
import PropTypes from 'prop-types'

class MultiType extends React.Component {
  constructor(props) {
    super(props)
    const initialState = {
      counter: 1,
    }
    this.initialState = initialState
    this.state = initialState

    if (this.props.model.edit) {
      let newState = Object.keys(this.props.model.options).length
      this.setState({ counter: newState })
    }
  }

  render() {
    return (
      <span>
        <br />
        {this._returnInputs()}
        <br />
        <button
          className="cte-save-btn btn-admin-blue"
          onClick={this._addInput.bind(this, this.state)}>
          add another option <i className="fa fa-plus" aria-hidden="true" />
        </button>
      </span>
    )
  }

  //  Custom Methods -------------------------------------------------------------
  _deleteInput(key) {
    let counter = this.state.counter
    let newState = counter - 1
    let opts = this.props.model.options
    let value = opts[key]
    let checked = this.props.model.defaultChecked

    delete opts[key]
    if (checked.includes(value)) {
      this._remove(checked, value)
    }
    // force a new render
    this.setState({ counter: newState })
  }

  _addInput() {
    let counter = this.state.counter
    let newState = counter + 1
    this.setState({ counter: newState })
  }

  _handleCheck(key) {
    let value = this.props.model.options[key]
    let checked = this.props.model.defaultChecked

    if (!checked.includes(value) && value != '') {
      checked.push(value)
    } else if (checked.includes(value)) {
      this._remove(checked, value)
    }
    this.forceUpdate()
  }

  _handleArray(key, e) {
    this.props.model.options[key] = e.target.value
  }

  _remove(arr, word) {
    let found = arr.indexOf(word)

    if (found !== -1) {
      arr.splice(found, 1)
      found = arr.indexOf(word)
    }
  }

  // Template Methods -------------------------------------------------------------
  _returnInputs() {
    let opts = this.props.model.options
    let counter = this.state.counter
    let type = this.props.type
    let options = []
    let key

    for (let i = 0; i < counter; i++) {
      let num = i + 1
      key = 'option ' + num
      // if option# does not exist within the object
      if (!opts[key]) {
        opts[key] = ''
      }
    }

    // map out opts
    Object.keys(opts).map(key => {
      let button = (
        <button
          className="admin-button"
          key={key + '_button'}
          onClick={this._handleCheck.bind(this, key)}>
          <i
            className={
              this.props.model.defaultChecked.includes(opts[key])
                ? 'fa fa-check-square-o'
                : 'fa fa-square-o'
            }
          />
          default checked
        </button>
      )

      let input = (
        <li key={key}>
          <Input
            key={key}
            type="text"
            value={opts[key]}
            name={key}
            placeholder={key}
            onChange={this._handleArray.bind(this, key)}
          />

          {type === 'multi' ? button : null}

          <button
            className="admin-button"
            onClick={this._deleteInput.bind(this, key)}>
            <i className="fa fa-trash-o" /> delete
          </button>
        </li>
      )
      // push to array of options within render function
      options.push(input)
    })

    return <span>{options}</span>
  }
}

export default MultiType

MultiType.propTypes = {
  type: PropTypes.string,
  onCheck: PropTypes.func,
  model: PropTypes.object,
}
