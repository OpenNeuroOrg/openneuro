// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import ArrayInput from '../common/forms/array-input.jsx'
import Input from '../common/forms/input.jsx'
// import Visibility from '../common/forms/visibility.jsx';
import { Modal, Panel } from 'react-bootstrap'
import Select from 'react-select'
import adminStore from './admin.store'
import actions from './admin.actions'
import config from '../../../config'

let vcpusMax = config.aws.batch.vcpusMax
let memoryMax = config.aws.batch.memoryMax

const PARAMETER_INPUTS = [
  { label: 'String', value: 'text' },
  { label: 'Boolean', value: 'checkbox' },
  { label: 'Number', value: 'numeric' },
  { label: 'List', value: 'select' },
  { label: 'File', value: 'file' },
]

const CreateJob = React.createClass({
  mixins: [Reflux.connect(adminStore)],

  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
  },

  render() {
    let definition = this.state.jobDefinitionForm
    let title = definition.edit ? 'Edit App' : 'Define an App'

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div>
            <Input
              placeholder="App Definition Name"
              value={definition.name}
              name={'name'}
              onChange={this._inputChange}
              disabled={!!definition.edit}
            />
            <Input
              placeholder="Bids Container"
              value={definition.containerImage}
              name={'containerImage'}
              onChange={this._inputChange}
            />
            <Input
              placeholder="Host Container"
              value={definition.hostImage}
              name={'hostImage'}
              onChange={this._inputChange}
            />
            <Panel header="Descriptions" collapsible defaultExpanded>
              {this._addDescriptions(definition)}
            </Panel>
            <Input
              placeholder="vCPUs"
              value={definition.vcpus}
              name={'vcpus'}
              onChange={this._inputChange}
            />
            <span>{'Max number of vCPUs is ' + vcpusMax}</span>
            <Input
              placeholder="Memory (MiB)"
              value={definition.memory}
              name={'memory'}
              onChange={this._inputChange}
            />
            <span>{'Max memory is ' + memoryMax + ' MiB'}</span>
            <div className="form-group">
              <label>Analysis Levels</label>
              <Select.Creatable
                value={definition.analysisLevels}
                name={'analysisLevels'}
                onChange={this._analysisLevelsChange}
                options={definition.analysisLevelOptions}
                multi
              />
            </div>
            <div className="form-group admin-job-parameters">
              <label>Parameters</label>
              <ArrayInput
                value={definition.parameters}
                onChange={this._handleChange.bind(null, 'parameters')}
                model={[
                  { id: 'label', placeholder: 'Key', required: true },
                  { id: 'defaultValue', placeholder: 'default value' },
                  {
                    id: 'type',
                    placeholder: 'Type',
                    select: PARAMETER_INPUTS,
                    required: true,
                  },
                  { id: 'description', placeholder: 'Parameter Description' },
                  { id: 'required', type: 'checkbox' },
                  { id: 'hidden', type: 'checkbox' },
                ]}
              />
            </div>
            <button
              className="btn-modal-submit"
              onClick={actions.submitJobDefinition}>
              <span>Submit</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    )
  },

  _handleChange(formProperty, e) {
    actions.inputChange('jobDefinitionForm', formProperty, e.target.value)
  },

  _inputChange(e) {
    actions.inputChange('jobDefinitionForm', e.target.name, e.target.value)
  },

  _analysisLevelsChange(e) {
    actions.inputChange('jobDefinitionForm', 'analysisLevels', e)
  },

  _addDescriptions(definition) {
    return [
      <Input
        placeholder="App Description"
        value={definition.description}
        name={'description'}
        onChange={this._inputChange}
        key={1}
      />,
      <Input
        placeholder="App short description"
        value={definition.shortDescription}
        name={'shortDescription'}
        onChange={this._inputChange}
        key={2}
      />,
      <Input
        placeholder="Support"
        value={definition.support}
        name={'support'}
        onChange={this._inputChange}
        key={3}
      />,
      <Input
        placeholder="Acknowledgements"
        value={definition.acknowledgements}
        name={'acknowledgements'}
        onChange={this._inputChange}
        key={4}
      />,
      <Input
        placeholder="Tags"
        value={definition.tags}
        name={'tags'}
        onChange={this._inputChange}
        key={5}
      />,
    ]
  },
})

export default CreateJob
