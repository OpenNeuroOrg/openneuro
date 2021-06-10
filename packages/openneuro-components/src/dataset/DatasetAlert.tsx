import React from 'react'

export interface DatasetAlertProps {}

export const DatasetAlert: React.FC<DatasetAlertProps> = ({}) => {
  return (
    <div className="dataset-header-alert">
      This dataset has not been published!
      <a href="">Publish the Dataset</a> to make all snapshots available
      publicly.
    </div>
  )
}
