import React, { useEffect, useState } from "react"
import { Button } from "../../components/button/Button"
import "../scss/user-meta-blocks.scss"

interface EditStringProps {
  value?: string
  setValue: (value: string) => void
  placeholder?: string
  closeEditing: () => void
  validation?: RegExp | ((value: string) => boolean)
  validationMessage?: string
}

export const EditString: React.FC<EditStringProps> = (
  {
    value = "",
    setValue,
    placeholder = "Enter text",
    closeEditing,
    validation,
    validationMessage,
  },
) => {
  const [currentValue, setCurrentValue] = useState<string>(value)
  const [warnEmpty, setWarnEmpty] = useState<string | null>(null)
  const [warnValidation, setWarnValidation] = useState<string | null>(null)

  // Helper for validation logic
  const isInputValid = (inputValue: string): boolean => {
    if (!validation) {
      return true
    }

    if (validation instanceof RegExp) {
      return validation.test(inputValue)
    } else if (typeof validation === "function") {
      return validation(inputValue)
    }

    return true
  }

  const trimmedCurrentValue = currentValue.trim()

  useEffect(() => {
    // Logic for "empty" warning
    if (value !== "" && trimmedCurrentValue === "") {
      setWarnEmpty(
        "Your input is empty. This will delete the previously saved value.",
      )
    } else {
      setWarnEmpty(null)
    }

    // Logic for "validation" warning
    if (trimmedCurrentValue !== "" && !isInputValid(trimmedCurrentValue)) {
      setWarnValidation(validationMessage || "Invalid input")
    } else {
      setWarnValidation(null)
    }
  }, [currentValue, value, validation, validationMessage])

  const handleSave = (): void => {
    if (warnValidation) {
      // Do not save if there's a validation error
      return
    }

    setValue(trimmedCurrentValue)
    closeEditing()
  }

  // Handle Enter key press for saving
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="edit-string-container">
      <div className="edit-string-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value)
            // Clear warnings as user types again
            if (warnEmpty || warnValidation) {
              setWarnEmpty(null)
              setWarnValidation(null)
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="edit-string-save"
          primary={true}
          size="small"
          label="Save"
          onClick={handleSave}
        />
      </div>
      {/* Display warning about deleting previous value if applicable */}
      {warnEmpty && trimmedCurrentValue === "" && (
        <small className="warning-text">{warnEmpty}</small>
      )}
      {/* Display validation error */}
      {warnValidation && (
        <small className="warning-text">{warnValidation}</small>
      )}
    </div>
  )
}
