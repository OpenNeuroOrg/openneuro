import React, { useState } from "react"
import DeleteDatasetForm from "../mutations/delete-dataset-form.jsx"
import DeleteDataset from "../mutations/delete.jsx"
import LoggedIn from "../../authentication/logged-in.jsx"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow3 } from "./styles/header-row"

interface DeletePageAction {
  datasetId: string
  hasEdit: boolean
}

export function DeletePageAction({ datasetId, hasEdit }: DeletePageAction) {
  const [values, setValues] = useState({
    reason: "",
    redirect: "",
  })
  const handleInputChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }
    setValues(newValues)
  }
  return (
    <>
      <DeleteDatasetForm
        values={values}
        onChange={handleInputChange}
        hideDisabled={false}
        hasEdit={hasEdit}
      />
      <p>
        <small className="warning-text">
          * Warning: this action will permanently remove this dataset along with
          associated snapshots.
        </small>
      </p>
      <div className="dataset-form-controls">
        <LoggedIn>
          <DeleteDataset datasetId={datasetId} metadata={values} />
        </LoggedIn>
      </div>
    </>
  )
}

interface DeletePageMessageProps {
  hasEdit: boolean
}

export function DeletePageMessage({ hasEdit }: DeletePageMessageProps) {
  if (hasEdit) {
    return (
      <>
        <p>
          This dataset has versions with DOIs that would be orphaned by
          deletion.
        </p>
        <p>
          If deletion is required please contact support to permanently remove a
          dataset and all versions of it. Provide a reason for the removal
          request and if the dataset is a duplicate or has been supplanted by
          another provide that information for a redirect to be created.
        </p>
      </>
    )
  } else {
    return (
      <p>
        Login or request dataset admin permissions from a dataset admin to
        delete this dataset.
      </p>
    )
  }
}

interface DeletePageProps {
  dataset: {
    permissions: Record<string, object>
    id: string
    snapshots: object[]
  }
  hasEdit: boolean
}

const DeletePage = (
  { dataset, hasEdit }: DeletePageProps,
): React.ReactElement => {
  const datasetId = dataset.id
  const canBeDeleted = dataset.snapshots.length === 0 && hasEdit
  return (
    <DatasetPageBorder>
      <HeaderRow3>Delete Dataset</HeaderRow3>
      {canBeDeleted
        ? <DeletePageAction datasetId={datasetId} hasEdit={hasEdit} />
        : <DeletePageMessage hasEdit={hasEdit} />}
    </DatasetPageBorder>
  )
}

export default DeletePage
