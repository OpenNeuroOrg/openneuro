import React from "react"

type UploadFileSelectProps = {
  resume?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onChange: (e?: { files: File[] }) => void
  disabled?: boolean
}

export const UploadFileSelect: React.FC<UploadFileSelectProps> = (
  { resume, onClick, onChange, disabled },
) => {
  const handleClick = (e: React.MouseEvent<HTMLInputElement>): void => {
    e.stopPropagation()
    // Reset the input value to allow selecting the same file/folder again
    if (e.target instanceof HTMLInputElement) {
      e.target.value = ""
    }
    if (onClick) onClick(e as React.MouseEvent<HTMLButtonElement>)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onChange({ files })
    }
  }

  const resumeIcon = (
    <span>
      <i className="fa fa-repeat" />
      &nbsp;
    </span>
  )
  const icon = resume ? resumeIcon : null
  const text = resume ? "Resume" : "Select folder"

  return (
    <div className={`fileupload-btn${disabled ? " disabled" : ""}`}>
      <span>
        {icon}
        {text}
      </span>
      <input
        type="file"
        id="multifile-select"
        className="multifile-select-btn"
        onClick={handleClick}
        onChange={handleFileSelect}
        webkitdirectory="true"
        directory="true"
        disabled={disabled}
      />
    </div>
  )
}

export default UploadFileSelect
