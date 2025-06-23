import React from "react"
import { Link } from "react-router-dom"

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
  const hexagonClass = modality ? modality.toLowerCase() : "no-modality"

  return (
    <div className="dataset-header">
      <div className="container">
        <div className="ds-header-inner">
          <div className="ds-inner-left">
            <h1>
              <Link to={"/search/modality/" + modality}>
                <div className="hexagon-wrapper">
                  <div className={`hexagon ${hexagonClass}`}></div>
                  <div className="label">
                    {modality
                      ? (
                        modality.substr(0, 4)
                      )
                      : <i className="fa fa-circle-o-notch fa-spin"></i>}
                  </div>
                </div>
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
