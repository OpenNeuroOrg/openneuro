import React, { useState } from 'react'
import UpdateDescription from '../mutations/description.jsx'
import { CancelButton } from './cancel-button'
import { EditButton } from './edit-button'
import Markdown from 'markdown-to-jsx'

import EditList from './edit-list.jsx'

const EditDescriptionList = ({
  datasetId,
  description,
  field,
  children,
  heading,
  editMode,
  className,
}) => {
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState(description || [])
  console.log(children)

  if (editing) {
    return (
      <div className={'dataset-meta-block ' + className}>
        <h2 className="dmb-heading">{heading}</h2>
        <EditList
          placeholder="Add new item"
          elements={rows}
          setElements={setRows}
        />
        <div className="update-field-save">
          <UpdateDescription
            datasetId={datasetId}
            field={field}
            value={rows}
            done={() => setEditing(false)}
          />
          <CancelButton action={() => setEditing(false)} />
        </div>
      </div>
    )
  } else {
    return (
      <div className={'dataset-meta-block ' + className}>
        <h2 className="dmb-heading">{heading}</h2>

        <ul>
          {children.map((item, index) => (
            <li key={index}>
              <Markdown>{item}</Markdown>
            </li>
          ))}
        </ul>

        {editMode && <EditButton action={() => setEditing(true)} />}
      </div>
    )
  }
}

export default EditDescriptionList
