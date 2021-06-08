import React from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie'
import { getProfile } from '../../refactor_2021/authentication/profile'
import { config } from '../../config'

const buildCustomQuery = (customText, prepopulatedFields) => {
  const customizerQueries = [
    ...Object.entries(customText).map(([key, value]) => `${key}=${value}`),
    ...Object.entries(prepopulatedFields)
      .filter(([, value]) => value)
      .map(([key, value]) => `helpdesk_ticket[${key}]=${value}`),
  ]
  return customizerQueries.length ? `&${customizerQueries.join(';')}` : ''
}

function FreshdeskWidget({ subject, error, sentryId, description }) {
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const sentry = sentryId && `Sentry ID: ${sentryId}`
  const joinedDescription = [sentry, description, error]
    .filter(item => item)
    .join(' \u2014 ')

  const customText = {
    widgetType: 'embedded',
    formTitle: 'Report+an+Issue',
    submitTitle: 'Request+Support',
    submitThanks:
      'Thank+you+for+taking+the+time+to+report+your+case.+A+support+representative+will+be+reviewing+your+request+and+will+send+you+a+personal+response+within+24+to+48+hours.',
    screenshot: 'No',
    captcha: 'yes',
  }
  const prepopulatedFields = {
    requester: profile && profile.email,
    subject,
    description: joinedDescription,
  }
  return (
    <>
      <script
        type="text/javascript"
        src="https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js"
      />
      <style type="text/css" media="screen, projection">
        {
          '@import url(https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css); '
        }
      </style>
      <iframe
        title="Feedback Form"
        className="freshwidget-embedded-form"
        id="freshwidget-embedded-form"
        src={
          config.support.url + buildCustomQuery(customText, prepopulatedFields)
        }
        scrolling="no"
        height="500px"
        width="100%"
        frameBorder="0"
      />
    </>
  )
}

FreshdeskWidget.propTypes = {
  subject: PropTypes.string,
  error: PropTypes.object,
  sentryId: PropTypes.string,
  description: PropTypes.string,
}

export default FreshdeskWidget
