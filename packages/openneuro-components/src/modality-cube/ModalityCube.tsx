import React from 'react'

import './modality-cube.scss'

export interface ModalityCubeProps {
  backgroundColor?: string
  backgroundImage?: string
  label: string
  stats: string
  cubeImage: string
}

export const ModalityCube: React.FC<ModalityCubeProps> = ({
  backgroundColor,
  label,
  backgroundImage,
  stats,
  cubeImage,
  ...props
}) => {
  const backGroundCubeImage = {
    backgroundImage: 'url(' + cubeImage + ')',
  }
  return (
    <div className="modality-cube-wrap" {...props}>
      <div className="hexagon hexagon-bg" style={{ backgroundColor }}>
        <span className="label">{label}</span>
        <span className="stats">{stats}</span>
        <div className="hexTop"></div>
        <div className="hexBottom"></div>
      </div>
      <div className="hexagon hexagon-img" style={backGroundCubeImage}>
        <div className="hexTop"></div>
        <div className="hexBottom"></div>
      </div>
      <div className="modality-cube">
        <div className="front" style={{ backgroundColor }}>
          <span className="label">{label}</span>
        </div>
        <div className="top"></div>
        <div className="right"></div>
      </div>
    </div>
  )
}
