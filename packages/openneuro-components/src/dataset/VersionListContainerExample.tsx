import React from 'react'
import { VersionList } from './VersionList'

export const VersionListContainerExample = ({ items, className }) => {
  const [selected, setSelected] = React.useState(items[0])
  return (
    <VersionList
      className={className}
      items={items}
      selected={selected}
      setSelected={setSelected}
    />
  )
}
