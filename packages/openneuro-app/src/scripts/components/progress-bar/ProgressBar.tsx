import React from "react"
import "./progress-bar.scss"

export interface ProgressBarProps {
  width?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ width }) => (
  <div className="progress">
    <div
      className="progress-bar"
      style={{ width: width.toString() + "%" }}
    >
    </div>
  </div>
)
