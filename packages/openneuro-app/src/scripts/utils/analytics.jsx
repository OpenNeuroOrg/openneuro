import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as GoogleAnalytics from 'react-ga'

const analyticsWrapper = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    GoogleAnalytics.set({
      page,
      ...options,
    })
    GoogleAnalytics.pageview(page)
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
