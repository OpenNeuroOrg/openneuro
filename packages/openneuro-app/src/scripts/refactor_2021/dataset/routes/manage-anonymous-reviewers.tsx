import React, { FC } from 'react'

//import { RemoveReviewLink } from '../mutations/TODO'
import { CreateReviewLink } from '../mutations/create-anonymous-reviewer'
const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

interface AnonymousReviewerProps {
  datasetId: string
  reviewers: {
    id: string
    expiration: Date
  }[]
}

export const AnonymousReviewer: FC<AnonymousReviewerProps> = ({
  datasetId,
  reviewers,
}) => {
  return (
    <div className="dataset-anonymous-form container">
      <div className="dataset-form-header">
        <div className="form-group">
          <h2>Create Anonymous Reviewer</h2>
        </div>
        <hr />
        <CreateReviewLink
          datasetId={datasetId}
          done={() => console.log('done')}
        />
        <div className="dataset-form-body">
          <h3>Previous Review Links: </h3>
          {reviewers?.map((item, index) => (
            <div key={index} className="data-table-content">
              <span>ID: {item.id}</span>
              <span>Expiration: {formatDate(item.expiration)}</span>
              <span>REMOVE TODO</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnonymousReviewer
