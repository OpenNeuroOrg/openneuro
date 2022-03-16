import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import DeleteDatasetForm from '../mutations/delete-dataset-form.jsx'
import DeleteDataset from '../mutations/delete.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import { hasEditPermissions, getProfile } from '../../authentication/profile.js'
import styled from '@emotion/styled'
import { Button } from '@openneuro/components/button'

interface DeletePageProps extends RouteComponentProps {
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
  const hasEdit =
    (user && user.admin) ||
    hasEditPermissions(dataset.permissions, user && user.sub)
  const datasetId = dataset.id
  return (
    <div className="container">
      <h2>Delete Dataset</h2>
      <hr />
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
      <div className=" dataset-form-controls">
        <LoggedIn>
          <DeleteDataset datasetId={datasetId} metadata={values} />
        </LoggedIn>
        <Link className="return-link" to={`/datasets/${datasetId}`}>
          Return to Dataset
        </Link>
      </div>
    </div>
  )
}

DeletePage.propTypes = {
  dataset: PropTypes.object,
  returnToDataset: PropTypes.func,
}

export default withRouter(DeletePage)
