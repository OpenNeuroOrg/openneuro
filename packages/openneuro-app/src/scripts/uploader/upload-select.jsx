import React from 'react'
import FileSelect from '../common/forms/file-select.jsx'
import UploaderContext from './uploader-context.js'
import styled from '@emotion/styled'

const GDPR = styled.p`
  text-align: center;
  margin: 20px 60px 0px 60px;
  font-size: 15px;
`

const UploadSelect = () => (
  <div>
    <GDPR>
      Notice: At this time we are not able to accept datasets protected by GDPR.
      <br />
      We apologize for this inconvenience.
    </GDPR>
    <UploaderContext.Consumer>
      {uploader => (
        <div className="message fade-in">
          Select a{' '}
          <a
            href="http://bids.neuroimaging.io"
            target="_blank"
            rel="noopener noreferrer">
            BIDS dataset
          </a>{' '}
          to upload
          <FileSelect onChange={uploader.selectFiles} />
        </div>
      )}
    </UploaderContext.Consumer>
  </div>
)

export default UploadSelect
