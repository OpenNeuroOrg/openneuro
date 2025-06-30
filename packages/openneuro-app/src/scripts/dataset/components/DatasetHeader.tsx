import React from "react"
import { Link } from "react-router-dom"
import { ModalityHexagon } from "../../components/modality-cube/ModalityHexagon"

export interface DatasetHeaderProps {
  modality: string | null | undefined
  pageHeading: string
  renderEditor?: () => React.ReactNode
  datasetUserActions?: React.ReactNode
  datasetHeaderTools?: React.ReactNode
}

export const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  pageHeading,
  modality,
  renderEditor,
  datasetHeaderTools,
  datasetUserActions,
}) => {
  return (
    <div className="dataset-header">
      <div className="container">
        <div className="ds-header-inner">
          <div className="ds-inner-left">
            <h1>
              <Link to={"/search/modality/" + modality}>
                <ModalityHexagon
                  primaryModality={modality ? modality.substr(0, 4) : null}
                />
              </Link>
              {renderEditor?.() || pageHeading}
            </h1>
            {datasetHeaderTools}
          </div>
          <div className="ds-inner-right">{datasetUserActions}</div>
        </div>
      </div>
    </div>
  )
}
