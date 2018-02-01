import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../config.js'

const downloadHandler = datasetHash => () => {
  const bucket = config.aws.s3.datasetBucket
  const url = `http://${bucket}.s3.amazonaws.com/${datasetHash}`
  fetch(url).then(res => {
    console.log('done!')
    console.log(res.text())
  })
}

const Archive = ({ run }) => {
  console.log(run)
  return <button onClick={downloadHandler(run.datasetHash)}>Download</button>
}

Archive.propTypes = {
  run: PropTypes.object,
}

export default Archive
