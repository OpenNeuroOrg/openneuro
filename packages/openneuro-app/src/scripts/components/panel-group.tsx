import React, { FC, ReactElement, ReactNode } from 'react'

interface PanelGroupProps {
  children: ReactNode
  accordion?: boolean
  activeKey?: string
  className?: string
  onSelect?: () => void
}

/**
 * Replacement for react-bootstrap 0.31.0 Panel
 * Only covers OpenNeuro use case
 */
export const PanelGroup: FC<PanelGroupProps> = ({
  children,
  className,
}): ReactElement => {
  return (
    <div className={`panel-group ${className}`} role="tablist">
      {children}
    </div>
  )
}
