import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../common/forms/warn-button.jsx'
import Input from '../common/forms/input.jsx'
import JobParameter from '../common/forms/job-parameter.jsx'

class JobParameterEdit extends React.Component {
  constructor(props) {
    super(props)
    let initialState = {
      edit: false,
      error: null,
    }
    for (let field of this.props.model) {
      initialState[field.id] = this.props.item[field.id]
    }

    this.state = initialState
  }

  componentWillReceiveProps() {
    this.setState({ edit: false })
  }

  render() {
    const viewControls = (
      <span>
        <div className="btn-wrap">
          <WarnButton
            message="Remove"
            icon="fa-times"
            action={this.props.remove}
          />
        </div>
        <div className="btn-wrap">
          <WarnButton
            message="Edit"
            warn={false}
            icon="fa-pencil"
            action={this._toggleEdit.bind(this)}
          />
        </div>
      </span>
    )

    let view = (
      <div className="cte-array-item">
        {this._display()}
        {this.props.item.label !== 'participant_label' ? viewControls : ''}
      </div>
    )

    let edit = (
      <div className="cte-array-item">
        <div className="text-danger">{this.state.error}</div>
        <div className="form-inline">
          {this._input()}
          <div className="btn-wrap array-edit">
            <button
              className="btn-warn-component warning"
              onClick={this._save.bind(this, this.props.model)}>
              <i className="fa fa-check" /> Save
            </button>
          </div>
          <div className="btn-wrap array-edit">
            <WarnButton
              message="Cancel"
              warn={false}
              icon="fa-times"
              action={this._cancel.bind(this)}
            />
          </div>
        </div>
      </div>
    )

    return this.state.edit ? edit : view
  }

  // template methods ---------------------------------------------------

  _display() {
    let item = this.props.item
    if (typeof item === 'object') {
      return (
        <span>
          {Object.keys(item).map(key => {
            return (
              <span className="reference-name" key={key}>
                {item[key]}
              </span>
            )
          })}
        </span>
      )
    } else {
      return <span className="reference-name">{item}</span>
    }
  }

  _input() {
    return (
      <div className="cte-edit-array">
        <div className="form-inline">
          <span>
            <Input
              name="label"
              value={this.state.label}
              placeholder="Key"
              type="text"
              onChange={this._handleChange.bind(this, 'label')}
            />

            <Input
              name="description"
              value={this.state.description}
              placeholder="Parameter Description"
              type="text"
              onChange={this._handleChange.bind(this, 'description')}
            />

            <button
              className="admin-button"
              onClick={this._toggleCheckBox.bind(this, 'required')}
              key="required">
              <i
                className={
                  this.state.required === true
                    ? 'fa fa-check-square-o'
                    : 'fa fa-square-o'
                }
              />{' '}
              required
            </button>

            <JobParameter
              selected={this.state.type}
              onCheck={this._toggleCheckBox.bind(this)}
              onChange={this._handleChange.bind(this)}
              model={this.state}
            />
            <br />
          </span>
        </div>
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _cancel() {
    this._toggleEdit()
    this.setState(this.initialState)
  }

  _toggleEdit() {
    this.setState({ edit: !this.state.edit })
  }

  _handleChange(key, event) {
    let state = {}
    state[key] = event.target.value
    this.setState(state)
  }

  _handleArray(key, field, event) {
    let opts = this.state.options
    opts[key] = event.target.value
  }

  _handleSelectChange(key, selected) {
    let state = {}
    state[key] = selected
    this.setState(state)
  }

  _toggleCheckBox(key) {
    let state = {}
    state[key] = !this.state[key]
    this.setState(state)
  }

  _save(model) {
    let data = {}
    for (let field of model) {
      data[field.id] = this.state[field.id]
    }
    this.props.onEdit(this.props.index, data)
  }
}

JobParameterEdit.propTypes = {
  model: PropTypes.array,
  item: props => {
    if (props.model.length > 1 && typeof props.item !== 'object') {
      return new Error(
        'Prop `item` must be an object if a model has more than one property',
      )
    }
    if (props.model.length == 1 && typeof props.item !== 'string') {
      return new Error(
        'Prop `item` must be a string if modal has a single property',
      )
    }
  },
  remove: PropTypes.func,
  onEdit: PropTypes.func,
  index: PropTypes.number,
  returnInput: PropTypes.func,
}

export default JobParameterEdit
