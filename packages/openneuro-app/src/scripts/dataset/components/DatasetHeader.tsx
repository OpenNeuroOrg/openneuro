import React from "react"
import { Link } from "react-router-dom"
import { ModalityHexagon } from "../../components/modality-cube/ModalityHexagon"

export interface DatasetHeaderProps {
  modality: string
  pageHeading: string
  renderEditor?: () => React.ReactNode
  children?: JSX.Element
}

export const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  pageHeading,
  modality,
  renderEditor,
  children,
}) => {
  return (
    <div className="dataset-header">
      <div className="container">
        <div className="grid grid-between">
          <div className="col">
            <h1>
              <Link to={"/search/modality/" + modality}>
                <ModalityHexagon
                  primaryModality={modality ? modality.substr(0, 4) : null}
                />
              </Link>
              {renderEditor?.() || pageHeading}
              {children}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
