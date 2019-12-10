import React from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'
import styled from '@emotion/styled'

const ProgressOuter = styled.div`
  width: 100%;
  height: 2px;
  background-color: #f5f5f5;
  margin: 10px 0;
`
const ProgressInner = styled(animated.div)`
  height: 100%;
  color: white;
  line-height: 2px;
  text-align: center;
  width: 0%;
`

/**
 * Estimate time to fetch files
 * @param {number} size Count of files
 */
export const estimateDuration = navigator => size => {
  // One file is about 100 bytes
  const estimatedBytes = size * 100
  if ('connection' in navigator) {
    // Estimate duration precisely if we can
    const downlink = navigator.connection.downlink
    return (estimatedBytes / (downlink * 1024)) * 1000 + 50
  } else {
    // Fallback estimate of a conservative general connection (10 mbps)
    return (estimatedBytes / (10 * 1024)) * 1000 + 50
  }
}

const FileTreeLoading = ({ size }) => {
  const config = {
    mass: 5,
    tension: 2000,
    friction: 200,
    duration: estimateDuration(navigator)(size),
  }
  const props = useSpring({
    config,
    from: {
      width: '0%',
      backgroundColor: '#f5f5f5',
    },
    to: { width: '100%', backgroundColor: 'var(--secondary)' },
  })
  return (
    <ProgressOuter>
      <ProgressInner style={props} />
    </ProgressOuter>
  )
}

FileTreeLoading.propTypes = {
  size: PropTypes.number,
}

export default FileTreeLoading
