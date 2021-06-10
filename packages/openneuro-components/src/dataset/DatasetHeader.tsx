import React from 'react'

export interface DatasetHeaderProps {
  modality: string
  pageHeading: string
}

export const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  pageHeading,
  modality,
}) => {
  return (
    <div className="dataset-header">
      <div className="container">
        <div className="grid grid-between">
          <div className="col">
            <h1>
              <a href={'/' + modality}>
                <div className="hexagon-wrapper">
                  <div className="hexagon no-modality"></div>
                  <div className="label">{modality.substr(0, 4)}</div>
                </div>
              </a>
              {pageHeading}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
