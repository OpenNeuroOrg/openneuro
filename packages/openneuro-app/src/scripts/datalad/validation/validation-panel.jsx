import React from 'react'
import PropTypes from 'prop-types'
import { Panel, PanelGroup } from 'react-bootstrap'

class ValidationPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '2',
    }
    this.togglePanel = this.togglePanel.bind(this)
  }

  togglePanel() {
    if (this.props.children.length && this.state.activeKey === '1') {
      this.setState({ activeKey: '2' })
    } else if (this.props.children.length && this.state.activeKey === '2') {
      this.setState({ activeKey: '1' })
    }
  }

  render() {
    return (
      <PanelGroup
        accordion
        className="validation-wrap"
        activeKey={this.state.activeKey}
        onSelect={this.togglePanel}>
        <Panel className="status" header={this.props.heading} eventKey="1">
          {this.props.children ? this.props.children : null}
        </Panel>
      </PanelGroup>
    )
  }
}

ValidationPanel.propTypes = {
  heading: PropTypes.object,
  children: PropTypes.node,
}

export default ValidationPanel
