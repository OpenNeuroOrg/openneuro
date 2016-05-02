// dependencies -------------------------------------------------------

import React      from 'react';
import {Modal}    from 'react-bootstrap';

export default class FileDisplay extends React.Component {

// life cycle events --------------------------------------------------


    render() {

        return (
            <Modal show={this.props.show} onHide={this.props.onHide} className="display-file-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.file.name}</Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    {this.props.file.text}
                </Modal.Body>
            </Modal>
        );
    }

// template methods ---------------------------------------------------


// custom methods -----------------------------------------------------



}

FileDisplay.propTypes = {
    file: React.PropTypes.object,
    onHide: React.PropTypes.func,
    show: React.PropTypes.bool
};