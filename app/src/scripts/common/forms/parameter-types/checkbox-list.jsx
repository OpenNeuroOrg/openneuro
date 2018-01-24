import React from 'react'
import Input from '../input.jsx'
import PropTypes from 'prop-types'

class CheckboxOrListParameter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 1,
      opts: {},
    }
  }

  render() {
    let options = []

    return (
      <span>
        <br />
        {this._returnInputs(options)}
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
    // force a new render
    this.setState({ counter: newState })

    // how in the heck do I do this
    // const {[key], ...newState } = this.state.opts

    delete this.state.opts[key]
    console.log(this.state)

    // stuck on logic here. Since I am using a counter to render each input option, when I force the re-render the number of options is off.
  }

  _addInput() {
    let counter = this.state.counter
    let newState = counter + 1
    this.setState({ counter: newState })
  }

  _handleCheck(key) {
    let checked = this.props.defChecked
    if (!checked.includes(key)) {
      checked.push(key)
    } else {
      checked.splice(key, 1)
    }
    // can I use this, or should I switch to a lifecycle method?
    this.forceUpdate()
  }

  _handleArray(key, e) {
    // update locally
    this.state.opts[key] = e.target.value
    //  update within parent for model save
    let value = e.target.value
    let event = { target: { value: value } }
    this.props.onArray(key, event)
  }

  // Template Methods -------------------------------------------------------------
  _returnInputs(options) {
    let counter = this.state.counter
    let type = this.props.type
    let key
    let opts = this.state.opts

    // Set up local object with keys equal to counter
    for (let i = 0; i < counter; i++) {
      let num = i + 1
      key = 'option ' + num
      // if option# does not exist within the object
      if (!this.state.opts[key]) {
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
              this.props.defChecked.includes(key)
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
            value={this.state.opts[key]}
            name={key}
            placeholder={key}
            onChange={this._handleArray.bind(this, key)}
          />

          {type === 'checkbox' ? button : null}

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

export default CheckboxOrListParameter

CheckboxOrListParameter.propTypes = {
  type: PropTypes.string,
  checked: PropTypes.array,
  defChecked: PropTypes.array,
  onCheck: PropTypes.func,
  onArray: PropTypes.func,
}
