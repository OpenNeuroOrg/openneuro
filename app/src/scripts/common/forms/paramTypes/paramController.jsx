import React from 'react'
import PropTypes from 'prop-types'
import Input from '../input.jsx'
// import CheckOrRadio from '../multi-radio-input.jsx'
// import StrOrNum from './stringOrNumberParam.jsx'

class ParamController extends React.Component {
  constructor(props) {
    super(props)
  }

  _selectControl() {
    let inputFields = []
    this.props.model.map(field => {
      console.log(field)
      if (this.props.selected != '') {
        if (field.type === 'checkbox') {
          inputFields.push(
            <button
              className="admin-button"
              onClick={this.props.onCheck}
              key={field.id}>
              <i className="fa fa-square-o" /> {field.id}
            </button>,
          )
        } else if (field.id != 'type') {
          inputFields.push(
            <Input
              type={this.props.selected}
              value={field.id}
              name={field.id}
              placeholder={field.placeholder}
              onInput={this.props.onInput}
              key={field.id}
            />,
          )
        }
      }
    })
    return <span>{inputFields}</span>
  }

  render() {
    return <div className="input-fields">{this._selectControl()}</div>
  }
}

ParamController.propTypes = {
  model: PropTypes.array.isRequired,
  selected: PropTypes.string,
  onInput: PropTypes.func,
  onCheck: PropTypes.func,
}

export default ParamController
