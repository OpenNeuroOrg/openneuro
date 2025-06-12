import React from "react"
import { Link } from "react-router-dom"

export interface DatasetHeaderProps {
  modality: string
  pageHeading: string
  renderEditor?: () => React.ReactNode
  children?: JSX.Element
  datasetHeaderTools: React.ReactNode
}

export const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  pageHeading,
  modality,
  renderEditor,
  children,
  datasetHeaderTools,
}) => {
  console.log(children)
  return (
    <div className="dataset-header">
      <div className="container">
        <div className="ds-header-inner">
          <div className="ds-inner-left">
            <h1>
              <Link to={"/search/modality/" + modality}>
                <div className="hexagon-wrapper">
                  <div className="hexagon no-modality"></div>
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
          <div className="ds-inner-right">{children}</div>
        </div>
      </div>
    </div>
  )
}
