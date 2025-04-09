import React, { useState } from "react"
import { Button } from "../../components/button/Button"
import "../scss/user-meta-blocks.scss"

interface EditListProps {
  placeholder?: string
  elements?: string[]
  setElements: (elements: string[]) => void
  validation?: RegExp
  validationMessage?: string
}

/**
 * EditList Component
 * Allows adding and removing strings from a list.
 */
export const EditList: React.FC<EditListProps> = (
  {
    placeholder = "Enter item",
    elements = [],
    setElements,
    validation,
    validationMessage,
  },
) => {
  const [newElement, setNewElement] = useState<string>("")
  const [warnEmpty, setWarnEmpty] = useState<boolean>(false)
  const [warnValidation, setWarnValidation] = useState<string | null>(null)

  const removeElement = (index: number): void => {
    setElements(elements.filter((_, i) => i !== index))
  }

  // Add a new element to the list
  const addElement = (): void => {
    if (!newElement.trim()) {
      setWarnEmpty(true)
      setWarnValidation(null)
    } else if (validation && !validation.test(newElement.trim())) {
      setWarnValidation(validationMessage || "Invalid input format")
      setWarnEmpty(false)
    } else {
      setElements([...elements, newElement.trim()])
      setWarnEmpty(false)
      setWarnValidation(null)
      setNewElement("")
    }
  }

  // Handle Enter/Return key press to add element
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      addElement()
    }
  }

  return (
    <div className="edit-list-container">
      <div className="el-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={newElement}
          onChange={(e) => setNewElement(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="edit-list-add"
          primary={true}
          size="small"
          label="Add"
          onClick={addElement}
        />
      </div>
      {warnEmpty && (
        <small className="warning-text">
          Your input was empty
        </small>
      )}
      {warnValidation && (
        <small className="warning-text">{warnValidation}</small>
      )}
      <div className="edit-list-items">
        {elements.map((element, index) => (
          <div key={index} className="edit-list-group-item">
            {element}
            <Button
              className="edit-list-remove"
              nobg={true}
              size="xsmall"
              icon="fa fa-times"
              label="Remove"
              color="red"
              onClick={() =>
                removeElement(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
