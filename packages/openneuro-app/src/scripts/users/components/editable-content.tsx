import React, { useState } from "react"
import { EditList } from "./edit-list"
import { EditString } from "./edit-string"
import { EditButton } from "./edit-button"
import { CloseButton } from "./close-button"
import { Markdown } from "../../utils/markdown"
import "../scss/editable-content.scss"

interface EditableContentProps {
  editableContent: string[] | string
  setRows: React.Dispatch<React.SetStateAction<string[] | string>>
  className: string
  heading: string
  validation?: RegExp
  validationMessage?: string
}

export const EditableContent: React.FC<EditableContentProps> = ({
  editableContent,
  setRows,
  className,
  heading,
  validation,
  validationMessage,
}) => {
  const [editing, setEditing] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const closeEditing = () => {
    setEditing(false)
    setWarning(null)
  }

  // Function to handle validation of user input
  const handleValidation = (value: string): boolean => {
    if (validation && !validation.test(value)) {
      setWarning(validationMessage || "Invalid input")
      return false
    }
    setWarning(null)
    return true
  }

  return (
    <div className={`user-meta-block ${className}`}>
      <span className="umb-heading">
        <h4>{heading}</h4>
        {editing
          ? <CloseButton action={closeEditing} />
          : <EditButton action={() => setEditing(true)} />}
      </span>
      {editing
        ? (
          <>
            {Array.isArray(editableContent)
              ? (
                <EditList
                  placeholder="Add new item"
                  elements={editableContent}
                  setElements={setRows as React.Dispatch<
                    React.SetStateAction<string[]>
                  >}
                  validation={validation}
                  validationMessage={validationMessage}
                />
              )
              : (
                <EditString
                  value={editableContent}
                  setValue={(newValue: string) => {
                    if (handleValidation(newValue)) {
                      setRows(newValue)
                    }
                  }}
                  placeholder="Edit content"
                  closeEditing={closeEditing}
                  warning={warning}
                />
              )}
          </>
        )
        : (
          <>
            {Array.isArray(editableContent)
              ? (
                <ul>
                  {editableContent.map((item, index) => (
                    <li key={index}>
                      <Markdown>{item}</Markdown>
                    </li>
                  ))}
                </ul>
              )
              : <Markdown>{editableContent}</Markdown>}
          </>
        )}
    </div>
  )
}
