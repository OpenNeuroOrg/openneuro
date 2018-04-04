import React from 'react'
import PropTypes from 'prop-types'
import TextOrNum from './parameter-types/text-num.jsx'
import MultiCheckbox from './parameter-types/multi.jsx'
import Checkbox from './parameter-types/checkbox.jsx'

export const PARAMETER_INPUTS = [
  { label: 'String', value: 'text' },
  { label: 'Boolean', value: 'checkbox' },
  { label: 'Multi', value: 'multi' },
  { label: 'Number', value: 'numeric' },
  { label: 'List', value: 'select' },
  { label: 'File', value: 'file' },
  { label: 'Radio', value: 'radio' },
]

/** Generic parameter, wrapper around the type */
class JobParameter extends React.Component {
  render() {
    let selected = this.props.selected
    let multiTypes = ['multi', 'select', 'radio']
    if (multiTypes.includes(selected)) {
      return (
        <MultiCheckbox
          type={selected}
          onCheck={this.props.onCheck}
          model={this.props.model}
        />
      )
    } else if (selected === 'checkbox') {
      return <Checkbox {...this.props} />
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
