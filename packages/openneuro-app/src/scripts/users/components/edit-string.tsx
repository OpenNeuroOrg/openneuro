import React, { useEffect, useState } from "react"
import { Button } from "@openneuro/components/button"
import "../scss/user-meta-blocks.scss"

interface EditStringProps {
  value?: string
  setValue: (value: string) => void
  placeholder?: string
  closeEditing: () => void
  validation?: RegExp // New validation prop
  validationMessage?: string // New validation message prop
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
  const [warnValidation, setWarnValidation] = useState<string | null>(null) // State for validation warning

  useEffect(() => {
    if (value !== "" && currentValue === "") {
      setWarnEmpty(
        "Your input is empty. This will delete the previously saved value..",
      )
    } else {
      setWarnEmpty(null)
    }

    if (validation && currentValue && !validation.test(currentValue)) {
      setWarnValidation(validationMessage || "Invalid input")
    } else {
      setWarnValidation(null)
    }
  }, [currentValue, value, validation, validationMessage])

  const handleSave = (): void => {
    if (!warnValidation && currentValue.trim() !== "") {
      setValue(currentValue.trim())
      closeEditing()
    }
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
          onChange={(e) => setCurrentValue(e.target.value)}
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
      {/* Show empty value warning */}
      {warnEmpty && currentValue === "" && (
        <small className="warning-text">{warnEmpty}</small>
      )}
      {/* Show validation error */}
      {warnValidation && (
        <small className="warning-text">{warnValidation}</small>
      )}
    </div>
  )
}
