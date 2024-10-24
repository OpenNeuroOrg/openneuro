import React from "react"
import type { FC } from "react"

export interface TooltipProps {
  tooltip: string
  flow?: "up" | "down" | "left" | "right"
  children: React.ReactNode
  className?: string
  wrapText?: boolean
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  tooltip,
  flow = "up",
  className,
  wrapText,
}) => {
  const wrap = wrapText && " wrap-text"
  return (
    <span
      className={(wrap || "") + " " + (className || "")}
      data-tooltip={tooltip}
      data-flow={flow}
    >
      {children}
    </span>
  )
}
