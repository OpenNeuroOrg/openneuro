// dependencies -------------------------------------------------------

import React       from 'react';
import {Modal}     from 'react-bootstrap';
import files       from '../utils/files';
import Papaya      from '../common/partials/papaya.jsx';
import {Table}   from 'reactable';

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
            return <iframe src={'http://docs.google.com/gview?url=' + content + '&embedded=true'} className="file-view-iframe" frameBorder='0'></iframe>;
        } else if (files.hasExtension(name, ['.tsv', '.csv'])) {
            return <Table className="table-responsive" data={this._parseTabular(name, content)}
                          sortable={true}
                          itemsPerPage={100}
                          pageButtonLimit={5} />
        } else if (files.hasExtension(name, ['.nii.gz'])) {
            return <Papaya image={content} />;
        } else {
            return content;
        }
    }

    _parseTabular(name, data) {
        // determine separator
        let separator;
        if (files.hasExtension(name, ['.tsv'])) {
            separator = '\t';
        } else if (files.hasExtension(name, ['.csv'])) {
            separator = ',';
        }

        let tableData = [];
        let rows    = data.split('\n');
        let headers = rows[0].split(separator);

        // remove headers from rows
        rows.shift();

        // convert rows to object format
        for (let row of rows) {
            if (row && !/^\s*$/.test(row)) {
                row = row.split(separator);
                let rowObj = {};
                for (let i = 0; i < headers.length; i++) {
                    rowObj[headers[i]] = row[i];
                }
                tableData.push(rowObj);
            }
        }

        return tableData
        // console.log(rows);
    }

}

// prop validation ----------------------------------------------------

FileDisplay.propTypes = {
    file: React.PropTypes.object,
    onHide: React.PropTypes.func,
    show: React.PropTypes.bool
};
