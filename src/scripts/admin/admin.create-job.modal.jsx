// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import Input      from '../common/forms/input.jsx';
import {Modal}    from 'react-bootstrap';
import adminStore from './admin.store';
import actions    from './admin.actions';


const CreateJob = React.createClass({

    mixins: [Reflux.connect(adminStore)],

    render() {
        let definition = this.state.jobDefinitionForm;

        return (
             <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Define a Job</Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    <div>
                        <Input placeholder="Job Definition Name"     value={definition.name}           name={'name'}           onChange={this._inputChange} />
                        <Input placeholder="Job Role ARN"            value={definition.jobRoleArn}     name={'jobRoleArn'}     onChange={this._inputChange} />
                        <Input placeholder="Container Image"         value={definition.containerImage} name={'containerImage'} onChange={this._inputChange} />
                        <Input placeholder="Command" type="textarea" value={definition.command}        name={'command'}        onChange={this._inputChange} />
                        <Input placeholder="vCPUs"                   value={definition.vcpus}          name={'vcpus'}          onChange={this._inputChange} />
                        <Input placeholder="Memory (MiB)"            value={definition.memory}         name={'name'}           onChange={this._inputChange} />
                        <button className="btn-modal-submit">
                            <span>Submit</span>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    },

    _inputChange (e) {
        actions.inputChange('jobDefinitionForm', e.target.name, e.target.value);
    }

});

export default CreateJob;