import React, { useState } from 'react'
import UpdateDescription from '../mutations/description.jsx'
import CancelButton from './cancel-button.jsx'
import EditButton from './edit-button.jsx'
import { Media } from '../../styles/media'

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
  editMode,
  rows = 1,
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(description[field] || '')

  if (editing) {
    return (
      <>
        <textarea
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
        <CancelButton action={() => setEditing(false)} />
      </>
    )
  } else {
    return (
      <>
        {children}
        {editMode && (
          <Media greaterThanOrEqual="medium">
            <EditButton action={() => setEditing(true)} />
          </Media>
        )}
      </>
    )
  }
}

export default EditDescriptionField
