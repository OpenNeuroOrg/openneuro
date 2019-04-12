import React, { useState } from 'react'
import UpdateDescription from '../mutations/description.jsx'
import EditButton from './edit-button.jsx'
import EditList from './edit-list.jsx'

const EditDescriptionList = ({
  datasetId,
  description,
  field,
  children,
  editMode,
}) => {
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState(description[field] || [])

  if (editing) {
    return (
      <>
        <EditList
          placeholder="Add new item"
          elements={rows}
          setElements={setRows}
        />
        <UpdateDescription
          datasetId={datasetId}
          field={field}
          value={rows}
          done={() => setEditing(false)}
        />
      </>
    )
  } else {
    return (
      <>
        {children}
        {editMode ? <EditButton action={() => setEditing(true)} /> : null}
      </>
    )
  }
}

export default EditDescriptionList
