import React, { useEffect, useRef } from 'react'
import './tooltip.scss'

export interface TooltipProps {
  tooltip: string
  flow: 'up' | 'down' | 'left' | 'right'
  children
}

export const Tooltip = ({ children, tooltip, flow }: TooltipProps) => {
  const reference = useRef()
  useEffect(() => {
    const placement =
      reference.current.offsetTop < 150 && flow === 'up' ? 'down' : flow
    reference.current.setAttribute('data-flow', placement)
  }, [])

  return (
    <span ref={reference} data-tooltip={tooltip} data-flow={flow}>
      {children}
    </span>
  )
}
