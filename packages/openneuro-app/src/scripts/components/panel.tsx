import React, { FC, ReactElement, ReactNode, useState } from 'react'

interface PanelProps {
  children: ReactNode
  header?: ReactNode
  eventKey?: string
  className?: string
}

/**
 * Replacement for react-bootstrap 0.31.0 Panel
 * Only covers OpenNeuro use case
 */
export const Panel: FC<PanelProps> = ({
  header,
  className,
  children,
}): ReactElement => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`panel panel-default ${className}`}>
      <div className="panel-heading">
        <div className="panel-title">
          <a
            role="tab"
            className={expanded ? null : 'collapsed'}
            aria-expanded={expanded}
            aria-selected={expanded}
            onClick={(): void => {
              setExpanded(!expanded)
            }}>
            {header}
          </a>
        </div>
      </div>
      <div
        className={`panel-collapse ${expanded ? 'collapse in' : 'collapse'}`}>
        <div className="panel-body">{children}</div>
      </div>
    </div>
  )
}
