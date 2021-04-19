// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* global papaya, papayaContainers, globalThis */
import React from 'react'
import PropTypes from 'prop-types'

class Papaya extends React.Component {
  // life cycle events --------------------------------------------------

  constructor(props) {
    super(props)
    this.state = {
      papayaWidth: this._calculateWidth(),
    }
  }

  componentDidMount() {
    // clear any old containers
    // eslint-disable-next-line no-global-assign, @typescript-eslint/no-unused-vars
    globalThis.papayaContainers = []

    const params = {
      worldSpace: true,
      fullScreen: false,
      allowScroll: false,
      fullScreenPadding: false,
      showControlBar: true,
      images: [this.props.image],
      kioskMode: true,
    }

    // rebuild container
    globalThis.papaya.Container.startPapaya()

    // start viewer
    globalThis.papaya.Container.resetViewer(0, params)

    // listen to window resizes
    globalThis.addEventListener('resize', this._updateDimensions.bind(this))
  }

  componentWillUnmount() {
    globalThis.removeEventListener('resize', this._updateDimensions.bind(this))
  }

  render() {
    return (
      <div
        className="papaya-wrap"
        style={{ width: this.state.papayaWidth + 'px' }}>
        <div className="papaya" />
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _calculateWidth() {
    const windowHeight = window.innerHeight
    const headerHeight = 90
    const contentHeight = windowHeight - headerHeight

    // estimate papaya viewer size ratio
    let denominator
    if (windowHeight > 1150) {
      denominator = 3
    } else if (windowHeight > 800) {
      denominator = 3.2
    } else if (windowHeight > 640) {
      denominator = 3.4
    } else if (windowHeight > 540) {
      denominator = 3.6
    } else if (windowHeight > 480) {
      denominator = 3.8
    } else if (windowHeight > 400) {
      denominator = 4
    } else if (windowHeight > 0) {
      denominator = 4.2
    }

    const viewerWidth = (contentHeight * 4) / denominator
    return viewerWidth
  }

  _updateDimensions() {
    this.setState({ papayaWidth: this._calculateWidth() })
  }
}

// prop validation ----------------------------------------------------

Papaya.propTypes = {
  image: PropTypes.string,
}

export default Papaya
