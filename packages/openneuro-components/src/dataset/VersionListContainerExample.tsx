import React from 'react'
import { VersionList } from './VersionList'

export const VersionListContainerExample = ({
  items,
  className,
  activeDataset,
  dateModified,
}) => {
  const [selected, setSelected] = React.useState(activeDataset)
  return (
    <VersionList
      className={className}
      items={items}
      selected={selected}
      setSelected={setSelected}
      activeDataset={activeDataset}
      dateModified={dateModified}
    />
  )
}
