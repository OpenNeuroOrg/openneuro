import React from "react"

export interface DatasetAlertProps {
  alert: string
  footer?: string
  level?: "warning" | "error" | "info"
}

export const DatasetAlert: React.FC<DatasetAlertProps> = ({
  alert,
  children,
  footer,
  level,
}) => (
  <div
    className={level ? `dataset-header-alert ${level}` : "dataset-header-alert"}
    role="alert"
  >
    <span>
      <strong>{alert}&#32;</strong>
      {children}
    </span>
    {footer && <small>{footer}</small>}
  </div>
)
