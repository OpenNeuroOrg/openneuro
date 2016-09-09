// dependencies -------------------------------------------------------

import React   from 'react';
import {Modal} from 'react-bootstrap';
import files   from '../utils/files';

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
                    {this._format(this.props.file.name, this.props.file.text)}
                </Modal.Body>
            </Modal>
        );
    }

// template methods ---------------------------------------------------


// custom methods -----------------------------------------------------

    _format(name, content) {
        if (files.hasExtension(name, ['.txt'])) {
            return content;
        } else if (files.hasExtension(name, ['.json'])) {
            try {
                return JSON.stringify(JSON.parse(content), null, 4);
            } catch (e) {
                return content;
            }
        } else if (files.hasExtension(name, ['.pdf'])) {
            return <iframe src={'http://docs.google.com/gview?url=' + content + '&embedded=true'} style={{width:'100%', height:'100%'}} frameBorder='0'></iframe>;
        } else {
            return content;
        }
    }

}

FileDisplay.propTypes = {
    file: React.PropTypes.object,
    onHide: React.PropTypes.func,
    show: React.PropTypes.bool
};