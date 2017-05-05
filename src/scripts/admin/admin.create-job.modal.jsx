// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import ArrayInput from '../common/forms/array-input.jsx';
import Input      from '../common/forms/input.jsx';
import {Modal}    from 'react-bootstrap';
import adminStore from './admin.store';
import actions    from './admin.actions';
import config     from '../../../config';

let vcpusMax = config.aws.batch.vcpusMax;
let memoryMax = config.aws.batch.memoryMax;


const CreateJob = React.createClass({

    mixins: [Reflux.connect(adminStore)],

    render() {
        let definition = this.state.jobDefinitionForm;
        let title = definition.edit ? "Edit Job" : "Define a Job";

        return (
             <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    <div>
                        <Input placeholder="Job Definition Name"     value={definition.name}           name={'name'}           onChange={this._inputChange} disabled={!!definition.edit} />
                        <Input placeholder="Bids Container"          value={definition.containerImage} name={'containerImage'} onChange={this._inputChange} />
                        <Input placeholder="Host Container"          value={definition.hostImage}      name={'hostImage'}      onChange={this._inputChange} />
                        <Input placeholder="vCPUs"                   value={definition.vcpus}          name={'vcpus'}          onChange={this._inputChange} />
                        <span>{'Max number of vCPUs is ' + vcpusMax}</span>
                        <Input placeholder="Memory (MiB)"            value={definition.memory}         name={'memory'}         onChange={this._inputChange} />
                        <span>{'Max memory is ' + memoryMax + 'GB'}</span>
                        <div className="form-group">
                             <label>Parameters</label>
                             <ArrayInput value={definition.parameters}
                                         onChange={this._handleChange.bind(null, 'parameters')}
                                         model={[
                                             {id: 'key', placeholder: 'Key', required: true},
                                             {id: 'defaultValue', placeholder: 'default value'}
                                         ]} />
                        </div>
                        <button className="btn-modal-submit" onClick={actions.submitJobDefinition}>
                            <span>Submit</span>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    },

    _handleChange (formProperty, e) {
        actions.inputChange('jobDefinitionForm', formProperty, e.target.value);
    },

    _inputChange (e) {
        actions.inputChange('jobDefinitionForm', e.target.name, e.target.value);
    }

});

export default CreateJob;
