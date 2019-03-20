import React, { useState } from 'react'
import UpdateDescription from '../mutations/description.jsx'
import EditButton from './edit-button.jsx'

const EditDescriptionList = ({
  datasetId,
  description,
  field,
  children,
  editable,
}) => {
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState(description[field] || [])
  const [value, setValue] = useState('')

  if (editing) {
    return (
      <>
        <ul>
          {rows.map((row, index) => (
            <li key={index}>{row}</li>
          ))}
        </ul>
        <input
          type="text"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <button
          onClick={() => {
            setRows([...rows, value])
            setValue('')
          }}>
          Add Item
        </button>
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
        {editable ? <EditButton action={() => setEditing(true)} /> : null}
      </>
    )
  }
}

export default EditDescriptionList
