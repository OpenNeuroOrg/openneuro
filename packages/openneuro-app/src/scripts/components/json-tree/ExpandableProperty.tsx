import * as React from "react"
import "./json-tree.scss"

interface Props {
  title: string
  expanded?: boolean
}

interface State {
  isOpen: boolean
}

export default class ExpandableProperty extends React.Component<Props, State> {
  state = {
    isOpen: !!this.props.expanded,
  }

  render() {
    return (
      <>
        <div
          className="expand-prop-name"
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        >
          {this.props.title}
          {this.state.isOpen ? "-" : "+"}
        </div>
        {this.state.isOpen ? this.props.children : null}
        {React.Children.count(this.props.children) === 0 && this.state.isOpen
          ? "The list is empty!"
          : null}
      </>
    )
  }
}
