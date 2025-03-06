import React from "react"
import { Link } from "react-router-dom"
import { ModalityLabel } from "../../components/formatting/modality-label"

export interface ModalitiesMetaDataBlockProps {
  items: string[]
  className?: string
}

export const ModalitiesMetaDataBlock = ({
  items,
  className,
}: ModalitiesMetaDataBlockProps) => {
  return (
    <div className={"dataset-meta-block " + className}>
      <h2 className="dmb-heading">Available Modalities</h2>
      {items.map((item, index) => (
        <Link key={index} to={"/search/modality/" + item.toLowerCase()}>
          <ModalityLabel modality={item} />
        </Link>
      ))}
    </div>
  )
}
