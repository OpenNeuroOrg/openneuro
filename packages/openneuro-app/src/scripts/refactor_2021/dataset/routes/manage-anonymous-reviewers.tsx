import React, { FC } from 'react'

import { DeleteReviewerLink } from '../mutations/delete-anonymous-reviewer'
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
        <CreateReviewLink datasetId={datasetId} />
        <div className="dataset-form-body">
          <h3>Previous Review Links: </h3>
          <div className="data-table-header">
            <span>ID</span>
            <span>Expiration</span>
            <span>Edit</span>
          </div>
          {reviewers?.map((item, index) => (
            <div key={index} className="data-table-content">
              <span>
                <label>ID: </label> {item.id}
              </span>
              <span>
                <label>Expiration: </label> {formatDate(item.expiration)}
              </span>
              <span>
                <DeleteReviewerLink datasetId={datasetId} id={item.id} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnonymousReviewer
