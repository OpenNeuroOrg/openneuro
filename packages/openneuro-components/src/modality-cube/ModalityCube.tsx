import React from "react"

export interface ModalityCubeProps {
  label: string
  stats: React.ReactNode
  portal: boolean
  cubeImage?: string
  altText?: string
  cubeFaceImage: string
  onClick: (redirectPath: string) => (e: React.MouseEvent) => void
}

export const ModalityCube: React.FC<ModalityCubeProps> = ({
  label,
  stats,
  portal = false,
  cubeImage,
  altText,
  cubeFaceImage,
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
                <span className="label">
                  {cubeFaceImage
                    ? (
                      <img
                        style={{ maxWidth: "120px" }}
                        src={cubeFaceImage}
                        alt={altText}
                      />
                    )
                    : label}
                </span>
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
