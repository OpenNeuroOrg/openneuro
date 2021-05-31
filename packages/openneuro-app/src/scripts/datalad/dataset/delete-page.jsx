import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import DeleteDatasetForm from '../mutations/delete-dataset-form.jsx'
import DeleteDataset from '../mutations/delete.jsx'
import LoggedIn from '../../authentication/logged-in.jsx'
import {
  hasEditPermissions,
  getProfile,
} from '../../refactor_2021/authentication/profile.js'
import styled from '@emotion/styled'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const WarningNote = styled.div({
  color: 'red',
  display: 'flex',

  i: {
    marginRight: '0.5rem',
  },
})

const DeletePage = ({ dataset, returnToDataset }) => {
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

  return (
    <Container>
      <header className="col-xs-12">
        <h1>Delete Dataset</h1>
        <hr />
      </header>
      <DeleteDatasetForm
        values={values}
        onChange={handleInputChange}
        hideDisabled={false}
        hasEdit={hasEdit}
      />
      <WarningNote className="col-sm-6">
        <i className="fa fa-asterisk" />
        <p>
          Warning: this action will permanently remove this dataset along with
          associated snapshots.
        </p>
      </WarningNote>
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <button className="btn-admin-blue" onClick={returnToDataset}>
            Return to Dataset
          </button>
          <LoggedIn>
            <DeleteDataset datasetId={dataset.id} metadata={values} />
          </LoggedIn>
        </div>
      </div>
    </Container>
  )
}

DeletePage.propTypes = {
  dataset: PropTypes.object,
  returnToDataset: PropTypes.func,
}

export default withRouter(DeletePage)
