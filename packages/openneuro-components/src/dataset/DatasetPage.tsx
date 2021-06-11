import React from 'react'

export interface DatasetPageProps {
  renderSidebar: () => React.ReactNode
  renderValidationBlock: () => React.ReactNode
  renderHeader: () => React.ReactNode
  renderAlert: () => React.ReactNode
  renderHeaderMeta: () => React.ReactNode
  renderToolButtons: () => React.ReactNode
  renderReadMe: () => React.ReactNode
  renderBrainLifeButton: () => React.ReactNode
  renderCloneDropdown: () => React.ReactNode
  renderDeprecatedModal: () => React.ReactNode
}

export const DatasetPage = ({
  renderSidebar,
  renderValidationBlock,
  renderHeader,
  renderAlert,
  renderHeaderMeta,
  renderToolButtons,
  renderReadMe,
  renderBrainLifeButton,
  renderCloneDropdown,
  renderDeprecatedModal,
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
            <div className="dataset-validation">
              {renderValidationBlock()}
              {renderBrainLifeButton()}
              {renderCloneDropdown()}
            </div>
            <div className="dataset-tool-buttons">{renderToolButtons()}</div>
            {renderReadMe()}
          </div>
          <div className="col sidebar"> {renderSidebar()}</div>
        </div>
      </div>
      {renderDeprecatedModal()}
    </>
  )
}
