import React from 'react'
import PropTypes from 'prop-types'
import TextParameter from './parameter-types/text.jsx'
import CheckboxParameter from './parameter-types/checkbox.jsx'
import NumericParameter from './parameter-types/numeric.jsx'
import SelectParameter from './parameter-types/list.jsx'
import FileParameter from './parameter-types/file.jsx'
import RadioParameter from './parameter-types/radio.jsx'

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
    if (this.props.selected === 'text') {
      return <TextParameter />
    } else if (this.props.selected === 'checkbox') {
      return <CheckboxParameter />
    } else if (this.props.selected === 'numeric') {
      return <NumericParameter />
    } else if (this.props.selected === 'select') {
      return <SelectParameter />
    } else if (this.props.selected === 'file') {
      return <FileParameter />
    } else if (this.props.selected === 'radio') {
      return (
        <RadioParameter
          counter={this.props.counter}
          addInput={this.props.addInput}
        />
      )
    } else {
      return null
    }
  }
}

JobParameter.propTypes = {
  selected: PropTypes.string,
  counter: PropTypes.number,
  addInput: PropTypes.func,
}

export default JobParameter
