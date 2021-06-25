import React from 'react'
import PropTypes from 'prop-types'
import { AccordionTab, AccordionWrap } from '@openneuro/components'

class ValidationPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <AccordionWrap className="validation-wrap">
        <AccordionTab
          className="status"
          label={this.props.heading} //eventKey="1"
        >
          {this.props.children ? this.props.children : null}
        </AccordionTab>
      </AccordionWrap>
    )
  }
}

ValidationPanel.propTypes = {
  heading: PropTypes.object,
  children: PropTypes.node,
}

export default ValidationPanel
