import React, { useState } from "react"
import { Button } from "../../components/button/Button"
import "../scss/user-meta-blocks.scss"

interface EditListProps {
  placeholder?: string
  elements?: string[]
  setElements: (elements: string[]) => void
  validation?: RegExp | ((value: string) => boolean)
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
  const isInputValid = (value: string): boolean => {
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

  // Add a new element to the list
  const addElement = (): void => {
    const trimmedNewElement = newElement.trim()

    if (!trimmedNewElement) {
      setWarnEmpty(true)
      setWarnValidation(null)
    } else if (!isInputValid(trimmedNewElement)) {
      setWarnValidation(validationMessage || "Invalid input format")
      setWarnEmpty(false)
    } else {
      setElements([...elements, trimmedNewElement])
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
          onChange={(e) => {
            setNewElement(e.target.value)
            if (warnEmpty || warnValidation) {
              setWarnEmpty(false)
              setWarnValidation(null)
            }
          }}
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
