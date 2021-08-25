import React from 'react'

export interface DatasetPageProps {
  renderSidebar: () => React.ReactNode
  renderValidationBlock: () => React.ReactNode
  renderHeader: () => React.ReactNode
  renderAlert?: () => React.ReactNode
  renderHeaderMeta: () => React.ReactNode
  renderToolButtons: () => React.ReactNode
  renderReadMe: () => React.ReactNode
  renderBrainLifeButton: () => React.ReactNode
  renderCloneDropdown: () => React.ReactNode
  renderDeprecatedModal: () => React.ReactNode
  renderFollowBookmark: () => React.ReactNode
  modality?: string
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
  renderFollowBookmark,
  modality,
}: DatasetPageProps) => {
  return (
    <div
      className={
        'dataset dataset-draft' +
        ' dataset-page dataset-page-' +
        modality.toLowerCase()
      }>
      {renderHeader()}
      {renderAlert()}
      <div className="container">
        <div className="grid grid-between dataset-header-meta">
          <div className="col col-8">{renderHeaderMeta()}</div>
          <div className="col follow-bookmark">{renderFollowBookmark()}</div>
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
    </div>
  )
}
