import React from "react"

export interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = ({}) => (
  <div
    className="cxq-spinner cxq-spinner--waveStretchDelay"
    role="alert"
    aria-busy="true"
  >
    <div className="cxq-spinner-hexagon "></div>
    <div className="rects">
      <div className="rect rect1"></div>
      <div className="rect rect2"></div>
      <div className="rect rect3"></div>
      <div className="rect rect4"></div>
      <div className="rect rect5"></div>
    </div>
  </div>
)
