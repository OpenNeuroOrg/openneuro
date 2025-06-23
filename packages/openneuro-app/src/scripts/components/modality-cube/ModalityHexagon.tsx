import React from "react"
import type { FC } from "react"

import "./modality-hexagon.scss"
interface ModalityHexagonProps {
  primaryModality: string | null | undefined
}

//ModalityHexagon component displays a colored hexagon and label
// based on the provided primaryModality.

export const ModalityHexagon: FC<ModalityHexagonProps> = ({
  primaryModality,
}) => {
  const hexagonClass = primaryModality
    ? primaryModality.toLowerCase()
    : "no-modality"

  const labelText = primaryModality?.toLowerCase() === "ieeg"
    ? "iEEG"
    : primaryModality?.toUpperCase() || (
      <i className="fa fa-circle-o-notch fa-spin"></i>
    )

  return (
    <div className="hexagon-wrapper">
      <div className={`hexagon ${hexagonClass}`}></div>
      <div className="label">{labelText}</div>
    </div>
  )
}
