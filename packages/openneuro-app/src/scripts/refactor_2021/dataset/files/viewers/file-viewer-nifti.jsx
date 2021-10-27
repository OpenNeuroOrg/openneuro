import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Niivue } from '@niivue/niivue'
import styled from '@emotion/styled'

const StyleWrapper = styled.div`
  div.papaya-wrap {
    margin: auto;
  }
`

const FileViewerNifti = ({ imageUrl }) => {
  useEffect(() => {
    const volumeList = [
      {
        url: imageUrl,
        volume: { hdr: null, img: null },
        colorMap: 'gray',
        opacity: 100,
        visible: true,
      },
    ]
    const nv = new Niivue()
    nv.attachTo('niivue')
    nv.loadVolumes(volumeList)
  }, [imageUrl])

  return (
    <StyleWrapper>
      <canvas id="niivue" height={480} width={640} />
    </StyleWrapper>
  )
}

FileViewerNifti.propTypes = {
  imageUrl: PropTypes.string,
}

export default FileViewerNifti
