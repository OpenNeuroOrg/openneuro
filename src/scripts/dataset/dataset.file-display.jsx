// dependencies -------------------------------------------------------

import React       from 'react';
import {Modal}     from 'react-bootstrap';
import files       from '../utils/files';
import Spreadsheet from '../common/partials/spreadsheet.jsx';
import Papaya      from '../common/partials/papaya.jsx';

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
                    {this._format(this.props.file.name, this.props.file.text, this.props.show)}
                </Modal.Body>
            </Modal>
        );
    }

// custom methods -----------------------------------------------------

    _format(name, content, show) {
        if (!show) {return false;}
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
        } else if (files.hasExtension(name, ['.tsv', '.csv'])) {
            return <Spreadsheet name={name} content={content} />;
        } else if (files.hasExtension(name, ['.nii.gz'])) {
            return <Papaya image={content} />;
        } else {
            return content;
        }
    }

}

// prop validation ----------------------------------------------------

FileDisplay.propTypes = {
    file: React.PropTypes.object,
    onHide: React.PropTypes.func,
    show: React.PropTypes.bool
};
