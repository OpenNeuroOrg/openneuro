// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import Input from '../common/forms/input.jsx'
import { Modal } from '../utils/modal.jsx'
import { Panel } from 'react-bootstrap'
import Select from 'react-select'
import adminStore from './admin.store'
import actions from './admin.actions'
import config from '../../../config'
import JobParameterSetup from './admin.job-parameter-setup.jsx'

let vcpusMax = config.aws.batch.vcpusMax
let memoryMax = config.aws.batch.memoryMax

import { refluxConnect } from '../utils/reflux'

class CreateJob extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, adminStore, 'admin')
  }

  render() {
    let definition = this.state.admin.jobDefinitionForm
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
              <JobParameterSetup parameters={definition.parameters} />
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
  }

  _handleChange(formProperty, e) {
    actions.inputChange('jobDefinitionForm', formProperty, e.target.value)
  }

  _inputChange(e) {
    actions.inputChange('jobDefinitionForm', e.target.name, e.target.value)
  }

  _analysisLevelsChange(e) {
    actions.inputChange('jobDefinitionForm', 'analysisLevels', e)
  }

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
  }
}

export default CreateJob
