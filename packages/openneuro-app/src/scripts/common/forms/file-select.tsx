// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

type UploadProps = {
  resume?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onChange?: (e?: { files: File[] }) => void
  disabled?: boolean
}

class Upload extends React.Component<UploadProps> {
  public static propTypes = {}
  // life cycle events --------------------------------------------------
  render(): React.ReactNode {
    const resumeIcon = (
      <span>
        <i className="fa fa-repeat" />
        &nbsp;
      </span>
    )
    const icon = this.props.resume ? resumeIcon : null
    const text = this.props.resume ? 'Resume' : 'Select folder'

    return (
      <div className="fileupload-btn">
        <span>
          {icon}
          {text}
        </span>
        <input
          type="file"
          id="multifile-select"
          className="multifile-select-btn"
          onClick={this._click.bind(this)}
          onChange={this._onFileSelect.bind(this)}
          webkitdirectory="true"
          directory="true"
          disabled={this.props.disabled}
        />
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _click(e): void {
    e.stopPropagation()
    e.target.value = null
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  _onFileSelect(e): void {
    if (e.target && e.target.files.length > 0) {
      const files = e.target.files
      this.props.onChange({ files })
    }
  }
}

Upload.propTypes = {
  resume: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: string
    webkitdirectory?: string
  }
}

export default Upload
