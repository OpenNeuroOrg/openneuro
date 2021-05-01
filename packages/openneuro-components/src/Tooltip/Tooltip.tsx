import React, { useEffect } from 'react'
import './tooltip.scss'

export interface TooltipProps {
  tooltip: string
  flow: 'up' | 'down' | 'left' | 'right'
}

export const Tooltip = ({
  children,
  tooltip,
  flow,
  ...props
}: TooltipProps) => {
  const myRef = React.createRef<HTMLSpanElement>()
  useEffect(() => {
    const placement =
      myRef.current.offsetTop < 150 && flow === 'up' ? 'down' : flow
    myRef.current.setAttribute('data-flow', placement)
  }, [])

  return (
    <span ref={myRef} data-tooltip={tooltip} {...props} data-flow={flow}>
      {children}
    </span>
  )
}
