import React from 'react'
import { VersionList } from './VersionList'

export const VersionListContainerExample = ({
  items,
  className,
  activeDataset,
  dateModified,
  selectedVersion,
  setSelectedVersion,
  rootPath,
  setDeprecatedModalIsOpen,
}) => {
  return (
    <VersionList
      rootPath={rootPath}
      className={className}
      items={items}
      selected={selectedVersion}
      setSelected={setSelectedVersion}
      activeDataset={activeDataset}
      dateModified={dateModified}
      setDeprecatedModalIsOpen={setDeprecatedModalIsOpen}
    />
  )
}
