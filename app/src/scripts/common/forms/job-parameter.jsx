import React from 'react'
import PropTypes from 'prop-types'
import TextParameter from './parameter-types/text.jsx'
import NumericParameter from './parameter-types/numeric.jsx'
import FileParameter from './parameter-types/file.jsx'
import RadioParameter from './parameter-types/radio.jsx'
import CheckboxOrListParameter from './parameter-types/checkbox-list.jsx'

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
    if (selected === 'text') {
      return <TextParameter />
    } else if (selected === 'checkbox' || selected === 'select') {
      return (
        <CheckboxOrListParameter
          // counter={this.props.counter}
          // addInput={this.props.addInput}
          type={selected}
        />
      )
    } else if (selected === 'numeric') {
      return <NumericParameter />
    } else if (selected === 'file') {
      return <FileParameter />
    } else if (selected === 'radio') {
      return (
        <RadioParameter
        // counter={this.props.counter}
        // addInput={this.props.addInput}
        />
      )
    } else {
      return null
    }
  }
}

JobParameter.propTypes = {
  selected: PropTypes.string,
}

export default JobParameter
