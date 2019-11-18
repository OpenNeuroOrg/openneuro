import React, { useState } from 'react'
import UpdateReadme from '../mutations/readme.jsx'
import EditButton from './edit-button.jsx'
import CancelButton from './cancel-button.jsx'

/**
 * This extends EditDescriptionField with Markdown display and a custom mutation
 */
const EditReadme = ({ datasetId, content, children, hasEdit, isMobile }) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(content || '')

  if (editing) {
    return (
      <>
        <textarea
          rows={12}
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <UpdateReadme
          datasetId={datasetId}
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
        {hasEdit && !isMobile ? (
          <EditButton action={() => setEditing(true)} />
        ) : null}
      </>
    )
  }
}

export default EditReadme
