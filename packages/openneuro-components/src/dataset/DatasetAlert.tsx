import React from 'react'
import { Link } from 'react-router-dom'

export interface DatasetAlertProps {
  rootPath: string
}

export const DatasetAlert: React.FC<DatasetAlertProps> = ({ rootPath }) => {
  return (
    <div className="dataset-header-alert">
      This dataset has not been published!
      <Link className="dataset-tool" to={rootPath + '/publish'}>
        Publish the Dataset
      </Link>
      to make all snapshots available publicly.
    </div>
  )
}
