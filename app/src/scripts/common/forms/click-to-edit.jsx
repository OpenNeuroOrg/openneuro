/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import ArrayInput from './array-input.jsx'
import FileArrayInput from './file-array-input.jsx'
import Spinner from '../partials/spinner.jsx'
import WarnButton from './warn-button.jsx'
import markdown from '../../utils/markdown'

class ClickToEdit extends React.Component {
  // life cycle events --------------------------------------------------
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      initialValue: JSON.stringify(props.value),
      loading: false,
      edit: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    // display edit when error is triggered
    if (nextProps.error) {
      this.setState({ edit: true })
    } else {
      this.setState({ value: nextProps.value })
    }
  }

  render() {
    let value = this.state.value
    let type = this.props.type
    let input, display

    switch (type) {
      case 'string':
        display = (
          <div className="cte-display">
            <div
              className="fade-in"
              dangerouslySetInnerHTML={markdown.format(value)}
            />
          </div>
        )
        input = (
          <div>
            <textarea
              className="form-control"
              value={value}
              onChange={this._handleChange.bind(null, type)}
            />
            <div className="btn-wrapper">
              <button
                className="cte-save-btn btn-admin-blue"
                onClick={this._save}>
                save
              </button>
            </div>
          </div>
        )
        break
      case 'authors':
        input = (
          <ArrayInput
            model={[
              { id: 'name', placeholder: 'Name', required: true },
              { id: 'ORCIDID', placeholder: 'ORCID ID' },
            ]}
            value={value}
            onChange={this._handleChange.bind(null, type)}
          />
        )
        display = <div className="cte-display">{this._authorList(value)}</div>
        break
      case 'referencesAndLinks':
        if (typeof value === 'string') {
          value = [value]
        }
        input = (
          <ArrayInput
            value={value}
            model={[
              { id: 'reference', placeholder: 'Reference', required: true },
            ]}
            onChange={this._handleChange.bind(null, type)}
          />
        )
        display = (
          <div className="cte-display">
            {this._referencesAndLinksList(value)}
          </div>
        )
        break
      case 'fileArray':
        input = (
          <FileArrayInput
            value={this.props.value}
            onChange={this._handleFile}
            onDelete={this._handleDelete}
            onFileClick={this._download}
          />
        )
        display = (
          <div className="cte-display">{this._fileList(this.props.value)}</div>
        )
        break
    }

    let edit = (
      <div className="cte-edit fade-in clearfix">
        {!this.state.loading ? input : null}
        <Spinner active={this.state.loading} />
      </div>
    )

    return (
      <div className="form-group">
        <label>
          {this.props.label} {this._editBtn()}
        </label>
        {this._error(this.props.error)}
        <div>{this.state.edit ? edit : display}</div>
      </div>
    )
  }

  // template methods ---------------------------------------------------

  _authorList(authors) {
    let list = authors.map((item, index) => {
      return (
        <div className="fade-in" key={index}>
          <span>
            {item.name} {item.ORCIDID ? '-' : null} {item.ORCIDID}
          </span>
        </div>
      )
    })
    return list
  }
  _referencesAndLinksList(refAndLinks) {
    if (typeof refAndLinks === 'string') {
      refAndLinks = [refAndLinks]
    } else if (refAndLinks.length === 1 && refAndLinks[0] === '') {
      refAndLinks = []
    }
    let list = refAndLinks.map((item, index) => {
      return (
        <div className="fade-in" key={index}>
          <span
            className="ref-link-markdown"
            dangerouslySetInnerHTML={markdown.format(item)}
          />
        </div>
      )
    })
    return list
  }

  _editBtn() {
    let edit = this.state.edit
    if (this.props.editable) {
      return (
        <button
          onClick={this._toggleEdit.bind(this)}
          className="cte-edit-button btn btn-admin fade-in">
          <span>
            <i className={'fa fa-' + (edit ? 'times' : 'pencil')} />{' '}
            {edit ? 'Hide' : 'Edit'}
          </span>
        </button>
      )
    }
  }

  _error(error) {
    if (error) {
      return (
        <div className="alert alert-danger">
          <button className="close" onClick={this.props.onDismissIssue}>
            <span>&times;</span>
          </button>
          {error}
        </div>
      )
    }
  }

  _fileList(files) {
    let list = files.map(file => {
      return (
        <div className="fade-in file-array" key={file.name}>
          <span>
            <span className="file-array-btn">
              <WarnButton
                tooltip="Download Attachment"
                icon="fa-download"
                prepDownload={this._download.bind(null, file.name)}
              />
            </span>
            {file.name}
          </span>
        </div>
      )
    })
    return list
  }

  // custom methods -----------------------------------------------------

  _display() {
    this.setState({ edit: false })
  }

  _toggleEdit() {
    this.setState({ edit: !this.state.edit })
  }

  _handleFile(file, callback) {
    if (this.props.onChange) {
      this.props.onChange(file, callback)
    }
  }

  _handleChange(type, event) {
    this.setState({ value: event.target.value }, () => {
      if (type === 'authors') {
        this._save(type)
      }
      if (type === 'referencesAndLinks') {
        this._save(type)
      }
    })
  }

  _handleDelete(filename, index) {
    if (this.props.onDelete) {
      this.props.onDelete(filename, index)
    }
  }

  _download(filename, callback) {
    if (this.props.onFileClick) {
      this.props.onFileClick(filename, callback)
    }
  }

  _save(type) {
    this.setState({ loading: true })
    let edit = type == 'authors' || type == 'referencesAndLinks'
    if (this.props.onChange) {
      this.props.onChange(this.state.value, () => {
        let initialValue = JSON.stringify(this.state.value)
        this.setState({
          loading: false,
          edit: edit,
          initialValue: initialValue,
        })
      })
    }
  }

  _cancel() {
    let value = JSON.parse(this.state.initialValue)
    this.setState({ edit: false, value: value })
  }
}

ClickToEdit.propTypes = {
  value: PropTypes.any,
  type: PropTypes.any,
  label: PropTypes.any,
  error: PropTypes.string,
  editable: PropTypes.bool,
  onDismissIssue: PropTypes.func,
  onDelete: PropTypes.func,
  onFileClick: PropTypes.func,
  onChange: PropTypes.func,
}

ClickToEdit.defaultProps = {
  editable: true,
  type: 'string',
  value: '',
}

export default ClickToEdit
