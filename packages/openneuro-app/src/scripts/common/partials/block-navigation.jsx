import React from 'react'
import PropTypes from 'prop-types'

class BlockNavigation extends React.Component {
  componentDidMount() {
    // Attempt to set a message even though browsers do not display it
    global.onbeforeunload = () =>
      this.props.message ? this.props.message : true
  }

  componentWillUnmount() {
    global.onbeforeunload = null
  }

  render() {
    return null
  }
}

BlockNavigation.propTypes = {
  message: PropTypes.string,
}

export default BlockNavigation
