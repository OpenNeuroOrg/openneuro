import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pageview } from '../utils/gtag'

const analyticsWrapper = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    pageview(page)
  }

  const HOC = class HOC extends Component {
    componentDidMount() {
      const page = this.props.location.pathname
      trackPage(page)
    }

    componentDidUpdate(prevProps) {
      const currentPage = prevProps.location.pathname
      const nextPage = this.props.location.pathname

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  HOC.propTypes = {
    location: PropTypes.object,
  }

  return HOC
}

export default analyticsWrapper
