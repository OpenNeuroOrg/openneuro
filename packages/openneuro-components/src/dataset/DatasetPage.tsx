import React from 'react'

export interface DatasetPageProps {
  renderSidebar: () => React.ReactNode
  renderValidationBlock: () => React.ReactNode
  renderHeader: () => React.ReactNode
  renderAlert: () => React.ReactNode
  renderHeaderMeta: () => React.ReactNode
  renderToolButtons: () => React.ReactNode
  renderReadMe: () => React.ReactNode
}

export const DatasetPage = ({
  renderSidebar,
  renderValidationBlock,
  renderHeader,
  renderAlert,
  renderHeaderMeta,
  renderToolButtons,
  renderReadMe,
}: DatasetPageProps) => {
  return (
    <>
      {renderHeader()}
      {renderAlert()}
      <div className="container">
        <div className="grid grid-between">
          <div className="col">{renderHeaderMeta()}</div>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-between">
          <div className="col col-8">
            {renderValidationBlock()}
            {renderToolButtons()}
            {renderReadMe()}
          </div>
          <div className="col sidebar"> {renderSidebar()}</div>
        </div>
      </div>
    </>
  )
}
