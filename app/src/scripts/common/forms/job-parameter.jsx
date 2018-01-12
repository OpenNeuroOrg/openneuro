import React from 'react'
import TextParameter from './parameter-types/text.jsx'
import CheckboxParameter from './parameter-types/checkbox.jsx'
import NumericParameter from './parameter-types/numeric.jsx'
import SelectParameter from './parameter-types/select.jsx'
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
    if (this.props.type === 'text') {
      return <TextParameter />
    } else if (this.props.type === 'checkbox') {
      return <CheckboxParameter />
    } else if (this.props.type === 'numeric') {
      return <NumericParameter />
    } else if (this.props.type === 'select') {
      return <SelectParameter />
    } else if (this.props.type === 'file') {
      return <FileParameter />
    } else if (this.props.type === 'radio') {
      return <RadioParameter />
    }
  }
}

export default JobParameter
