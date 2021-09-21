import React from 'react'
import { VersionList } from './VersionList'

export const VersionListContainerExample = ({
  items,
  className,
  activeDataset,
  dateModified,
  selectedVersion,
  setSelectedVersion,
  datasetId,
  setDeprecatedModalIsOpen,
  hasEdit,
}) => {
  return (
    <VersionList
      datasetId={datasetId}
      className={className}
      items={items}
      selected={selectedVersion}
      setSelected={setSelectedVersion}
      activeDataset={activeDataset}
      dateModified={dateModified}
      setDeprecatedModalIsOpen={setDeprecatedModalIsOpen}
      hasEdit={hasEdit}
    />
  )
}
