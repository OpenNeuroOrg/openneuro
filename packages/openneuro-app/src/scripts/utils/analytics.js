import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoogleAnalytics from 'react-ga'
import config from '../../../config'

GoogleAnalytics.initialize(config.analytics.trackingId)

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

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

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
