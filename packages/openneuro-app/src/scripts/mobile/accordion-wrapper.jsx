import React, { useState } from 'react'
import './accordion.scss'

const PlusIcon = () => {
  return (
    <span className="panel__header-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M14,7H9V2A1,1,0,0,0,7,2V7H2A1,1,0,0,0,2,9H7v5a1,1,0,0,0,2,0V9h5a1,1,0,0,0,0-2Z"
        />
      </svg>
    </span>
  )
}

const MinusIcon = () => {
  return (
    <span className="panel__header-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 16 16">
        <path fill="currentColor" d="M14,9H2A1,1,0,0,1,2,7H14a1,1,0,0,1,0,2Z" />
      </svg>
    </span>
  )
}

const PanelHeader = props => {
  return (
    <button
      className="panel__header"
      onClick={props.handleToggle}
      onKeyDown={props.handleKeyDown}
      aria-expanded={props.isExpanded}>
      {props.children}
      {props.isExpanded ? <MinusIcon /> : <PlusIcon />}
    </button>
  )
}

const PanelBody = props => {
  return (
    <div className="panel__body" aria-hidden={props.isExpanded}>
      {props.children}
    </div>
  )
}

const PanelGroup = props => {
  return (
    <div className="panel-group" role="group">
      {props.children}
    </div>
  )
}

class Panel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isExpanded: props.openDefault,
    }

    this.handleToggle = this.handleToggle.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleToggle() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    })
  }

  handleKeyDown(event) {
    if (event.keyCode == 40) {
      event.preventDefault()
      this.setState({
        isExpanded: true,
      })
    }

    if (event.keyCode == 38) {
      event.preventDefault()
      this.setState({
        isExpanded: false,
      })
    }
  }

  render() {
    return (
      <div className="panel">
        <PanelHeader
          handleToggle={this.handleToggle}
          handleKeyDown={this.handleKeyDown}
          isExpanded={this.state.isExpanded}>
          {this.props.title}
        </PanelHeader>
        <PanelBody isExpanded={!this.state.isExpanded}>
          {this.props.children}
        </PanelBody>
      </div>
    )
  }
}

export default Panel
