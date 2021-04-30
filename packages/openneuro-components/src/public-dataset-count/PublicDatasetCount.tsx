import React from 'react'

export interface PublicDatasetCountProps {
  count?: number
}

export const PublicDatasetCount: React.FC<PublicDatasetCountProps> = ({
  count = 0,
}) => (
  <div>
    <span>{count.toLocaleString()}</span> Public Datasets
  </div>
)
