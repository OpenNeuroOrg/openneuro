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
  className?: string
  heading: string
  validation?: RegExp | ((value: string) => boolean)
  validationMessage?: string
  "data-testid"?: string
}

export const EditableContent: React.FC<EditableContentProps> = ({
  editableContent,
  setRows,
  className,
  heading,
  validation,
  validationMessage,
  "data-testid": testId,
}) => {
  const [editing, setEditing] = useState(false)

  const closeEditing = () => {
    setEditing(false)
  }

  // Function to handle validation of user input
  const handleValidation = (value: string): boolean => {
    if (!validation) {
      return true
    }

    if (validation instanceof RegExp) {
      return validation.test(value)
    } else if (typeof validation === "function") {
      return validation(value)
    }

    return true
  }

  return (
    <div className={`user-meta-block ${className}`} data-testid={testId}>
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
                  validation={validation}
                  validationMessage={validationMessage}
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
