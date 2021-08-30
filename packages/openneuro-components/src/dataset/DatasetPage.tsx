import React from 'react'

export interface DatasetPageProps {
  renderSidebar: () => React.ReactNode
  renderValidationBlock: () => React.ReactNode
  renderHeader: () => React.ReactNode
  renderAlert?: () => React.ReactNode
  renderHeaderMeta: () => React.ReactNode
  renderToolButtons: () => React.ReactNode
  renderFileTree: () => React.ReactNode
  renderReadMe: () => React.ReactNode
  renderBrainLifeButton: () => React.ReactNode
  renderCloneDropdown: () => React.ReactNode
  renderDeprecatedModal: () => React.ReactNode
  renderFollowBookmark: () => React.ReactNode
  renderComments: () => React.ReactNode
  modality?: string
}

export const DatasetPage = ({
  renderSidebar,
  renderValidationBlock,
  renderHeader,
  renderAlert,
  renderHeaderMeta,
  renderToolButtons,
  renderFileTree,
  renderReadMe,
  renderBrainLifeButton,
  renderCloneDropdown,
  renderDeprecatedModal,
  renderFollowBookmark,
  renderComments,
  modality,
}: DatasetPageProps) => {
  return (
    <div
      className={
        'dataset dataset-draft' +
        ' dataset-page dataset-page-' +
        modality?.toLowerCase()
      }>
      {renderHeader()}
      {renderAlert && renderAlert()}
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
            {renderFileTree()}
            {renderReadMe()}
            {renderComments()}
          </div>
          <div className="col sidebar"> {renderSidebar()}</div>
        </div>
      </div>
      {renderDeprecatedModal()}
    </div>
  )
}
