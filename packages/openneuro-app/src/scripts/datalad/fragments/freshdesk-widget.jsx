import React from 'react'
import withProfile from '../../authentication/withProfile.js'
import config from '../../../../config'

const prepopulatedFieldsQuery = prepopulatedFields => {
  const fieldQueries = Object.entries(prepopulatedFields)
    .filter(([key, value]) => value)
    .map(([key, value]) => `helpdesk_ticket[${key}]=${value}`)
  return `&${fieldQueries.join(';')}`
}

function FreshdeskWidget({ profile, subject, description }) {
  console.log(profile, subject, description)
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
          config.support.url +
          prepopulatedFieldsQuery({
            requester: profile.email,
            subject,
            description,
          })
        }
        scrolling="no"
        height="500px"
        width="100%"
        frameBorder="0"
      />
    </>
  )
}

export default withProfile(FreshdeskWidget)
