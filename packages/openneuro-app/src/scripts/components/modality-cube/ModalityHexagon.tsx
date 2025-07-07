import React from "react"
import type { FC } from "react"
import { modalityShortMapping } from "../../components/formatting/modality-label"
import "./modality-hexagon.scss"
interface ModalityHexagonProps {
  primaryModality: string | null | undefined
  size?: string | null | undefined
}

//ModalityHexagon component displays a colored hexagon and label
// based on the provided primaryModality.

export const ModalityHexagon: FC<ModalityHexagonProps> = ({
  primaryModality,
  size,
}) => {
  const hexagonClass = primaryModality
    ? primaryModality.toLowerCase()
    : "no-modality"

  const labelText = primaryModality
    ? modalityShortMapping(primaryModality)
    : <i className="fa fa-circle-o-notch fa-spin"></i>

  return (
    <div className={`hexagon-wrapper ${size}`}>
      <div className={`hexagon ${hexagonClass}`}></div>
      <div className="label">{labelText}</div>
    </div>
  )
}
