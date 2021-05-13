import React from 'react'

export interface AggregateCountProps {
  count?: number
  type: 'publicDataset' | 'participants'
}

export const AggregateCount = ({ count, type }: AggregateCountProps) => {
  const textContent: string = {
    publicDataset: 'Public Dataset',
    participants: 'Participant',
  }[type]

  return (
    <div className="aggregate-count">
      <span>{count.toLocaleString()}</span> {textContent}
      {count !== 1 && 's'}
    </div>
  )
}
