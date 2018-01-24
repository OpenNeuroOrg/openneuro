import React from 'react'
import PropTypes from 'prop-types'
import TextOrNum from './parameter-types/text-num.jsx'
import MultiType from './parameter-types/multi.jsx'

export const PARAMETER_INPUTS = [
  { label: 'String', value: 'text' },
  { label: 'Boolean', value: 'checkbox' },
  { label: 'Number', value: 'numeric' },
  { label: 'List', value: 'select' },
  { label: 'File', value: 'file' },
  { label: 'Radio', value: 'radio' },
]

/** Generic parameter, wrapper around the type */
class JobParameter extends React.Component {
  render() {
    let selected = this.props.selected
    let multiTypes = ['checkbox', 'select', 'radio']
    if (multiTypes.includes(selected)) {
      return (
        <MultiType
          type={selected}
          onCheck={this.props.onCheck}
          model={this.props.model}
        />
      )
    } else {
      return (
        <TextOrNum
          type={selected}
          onCheck={this.props.onCheck}
          onChange={this.props.onChange}
          model={this.props.model}
        />
      )
    }
  }
}

JobParameter.propTypes = {
  selected: PropTypes.string,
  onCheck: PropTypes.func,
  onArray: PropTypes.func,
  onChange: PropTypes.func,
  model: PropTypes.object,
}

export default JobParameter
