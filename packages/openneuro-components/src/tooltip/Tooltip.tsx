import React, { useEffect, useRef } from 'react'
import './tooltip.scss'

export interface TooltipProps {
  tooltip: string
  flow: 'up' | 'down' | 'left' | 'right'
  children: React.ReactNode
  className?: string
  wrapText?: boolean
}

export const Tooltip = ({
  children,
  tooltip,
  flow,
  className,
  wrapText,
}: TooltipProps) => {
  const wrap = wrapText && ' wrap-text'
  return (
    <span
      className={wrap + ' ' + className}
      data-tooltip={tooltip}
      data-flow={flow}>
      {children}
    </span>
  )
}
