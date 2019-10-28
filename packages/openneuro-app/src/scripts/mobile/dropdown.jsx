import React from 'react'

class DropdownWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = { value: 'select' }
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <select value={this.state.value} onChange={this.onChange.bind(this)}>
          {this.props.children}
        </select>
      </div>
    )
  }
}

export default DropdownWrapper
