import React, { useState } from 'react'
import UpdateDescription from '../mutations/description.jsx'
import WarnButton from '../../common/forms/warn-button.jsx'

/**
 * This is a hopefully less confusing click-to-edit component
 *
 * Editing is standardized but display is handled by any child component
 */
const EditDescriptionField = ({
  datasetId,
  description,
  field,
  children,
  rows = 1,
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(description[field] || '')

  if (editing) {
    return (
      <>
        <input
          type="textarea"
          rows={rows}
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <UpdateDescription
          datasetId={datasetId}
          field={field}
          value={value}
          done={() => setEditing(false)}
        />
      </>
    )
  } else {
    return (
      <>
        {children}
        <WarnButton
          message="Edit"
          icon="fa-edit"
          warn={false}
          action={cb => {
            setEditing(true)
            cb()
          }}
        />
      </>
    )
  }
}

export default EditDescriptionField
