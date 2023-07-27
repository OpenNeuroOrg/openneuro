import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import DeleteDatasetForm from '../mutations/delete-dataset-form.jsx'
import DeleteDataset from '../mutations/delete.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import { getProfile } from '../../authentication/profile'
import AdminUser from '../../authentication/admin-user.jsx'
import { RegularUser } from '../../authentication/regular-user'
import { DatasetPageBorder } from './styles/dataset-page-border'
import { HeaderRow3 } from './styles/header-row'

interface DeletePageProps {
  dataset: {
    permissions: Record<string, any>
    id: string
  }
}

const DeletePage = ({ dataset }: DeletePageProps): React.ReactElement => {
  const [values, setValues] = useState({
    reason: '',
    redirect: '',
  })
  const handleInputChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }
    setValues(newValues)
  }
  const [cookies] = useCookies()
  const user = getProfile(cookies)
  const hasEdit = user && user.admin
  const datasetId = dataset.id
  return (
    <DatasetPageBorder>
      <HeaderRow3>Delete Dataset</HeaderRow3>
      <AdminUser>
        <DeleteDatasetForm
          values={values}
          onChange={handleInputChange}
          hideDisabled={false}
          hasEdit={hasEdit}
        />
        <p>
          <small className="warning-text">
            * Warning: this action will permanently remove this dataset along
            with associated snapshots.
          </small>
        </p>
        <div className="dataset-form-controls">
          <LoggedIn>
            <DeleteDataset datasetId={datasetId} metadata={values} />
          </LoggedIn>
        </div>
      </AdminUser>
      <RegularUser>
        <p>
          Please contact support to permanently remove a dataset and all
          versions of it. Provide a reason for the removal request and if the
          dataset is a duplicate or has been supplanted by another provide that
          information for a redirect to be created.
        </p>
      </RegularUser>
    </DatasetPageBorder>
  )
}

export default DeletePage
