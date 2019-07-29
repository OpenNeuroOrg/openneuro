import React from 'react'
import { getProfile } from '../../authentication/profile'
import config from '../../../../config'

const buildCustomQuery = (customText, prepopulatedFields) => {
  const customizerQueries = [
    ...Object.entries(customText).map(([key, value]) => `${key}=${value}`),
    ...Object.entries(prepopulatedFields)
      .filter(([, value]) => value)
      .map(([key, value]) => `helpdesk_ticket[${key}]=${value}`),
  ]
  return customizerQueries.length ? `&${customizerQueries.join(';')}` : ''
}

function FreshdeskWidget(props) {
  const profile = getProfile()
  const { subject, error, sentryId } = props
  let { description } = props
  const sentry = sentryId && `Sentry ID: ${sentryId}`
  description = [sentry, description, error]
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
    description,
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

export default FreshdeskWidget
