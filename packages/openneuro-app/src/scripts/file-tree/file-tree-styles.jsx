import { animated } from 'react-spring'
import styled from '@emotion/styled'

export const Frame = styled('div')`
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  vertical-align: middle;
`

export const Title = styled('span')`
  vertical-align: middle;
`

export const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  border-left: 1px dashed rgba(255, 255, 255, 0.4);
  overflow: hidden;
`
