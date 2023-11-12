import React from "react"
import { Link } from "react-router-dom"

export interface ModalityCubeProps {
  label: string
  stats: React.ReactNode
  cubeImage: string
  onClick: (redirectPath: string) => (e: React.MouseEvent) => void
}

export const ModalityCube: React.FC<ModalityCubeProps> = ({
  label,
  stats,
  cubeImage,
  onClick,
}) => {
  return (
    <li
      className="hex"
      onClick={onClick("search/modality/" + label.toLowerCase())}
    >
      <div className={"hexIn " + label.toLowerCase() + "-cube"}>
        <div>
          <div
            className="img"
            style={{ backgroundImage: `url(${cubeImage})` }}
          >
            <div className="modality-cube">
              <div className="front">
                <span className="label">{label}</span>
              </div>
              <div className="top"></div>
              <div className="right"></div>
            </div>
            <h3 className="content1">{label}</h3>
            <div className="content2">{stats}</div>
          </div>
        </div>
      </div>
    </li>
  )
}
