import React, { useState } from 'react'
import UpdateDescription from '../mutations/description.jsx'
import UpdateReadme from '../mutations/readme.jsx'

import { CancelButton } from './cancel-button'
import { EditButton } from './edit-button'

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
  const [value, setValue] = useState(description || '')
  if (editing) {
    return (
      <>
        <textarea
          className="edit-description-field"
          rows={rows}
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <div className="update-field-save">
          {field == 'readme' ? (
            <UpdateReadme
              datasetId={datasetId}
              value={value}
              done={() => setEditing(false)}
            />
          ) : (
            <UpdateDescription
              datasetId={datasetId}
              field={field}
              value={value}
              done={() => setEditing(false)}
            />
          )}

          <CancelButton action={() => setEditing(false)} />
        </div>
      </>
    )
  } else {
    return (
      <>
        {children}
        {editMode && <EditButton action={() => setEditing(true)} />}
      </>
    )
  }
}

export default EditDescriptionField
