import React from "react"

export interface ModalityCubeProps {
  label: string
  stats: React.ReactNode
  portal: boolean
  cubeImage: string
  onClick: (redirectPath: string) => (e: React.MouseEvent) => void
}

export const ModalityCube: React.FC<ModalityCubeProps> = ({
  label,
  stats,
  portal = false,
  cubeImage,
  onClick,
}) => {
  return (
    <li
      className="hex"
      onClick={portal
        ? onClick("search/" + label.toLowerCase())
        : onClick("search/modality/" + label.toLowerCase())}
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
