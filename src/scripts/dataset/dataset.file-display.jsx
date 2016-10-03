// dependencies -------------------------------------------------------

import React   from 'react';
import {Modal} from 'react-bootstrap';
import files   from '../utils/files';
import Papaya  from '../common/partials/papaya.jsx';
import Tooltip  from '../common/partials/tooltip.jsx';
import {Table} from 'reactable';

export default class FileDisplay extends React.Component {

// life cycle events --------------------------------------------------

    render() {
        if (!this.props.show) {return false;}
        let file = this.props.file;

        return (
            <Modal show={this.props.show} onHide={this.props.onHide} className="display-file-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{file.name}<div className="modal-download btn-admin-blue">{this._download(file.link)}</div></Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    {this._format(file.name, file.text, file.link)}
                </Modal.Body>
            </Modal>
        );
    }

// template methods ---------------------------------------------------

    _download(link) {
        return <a href={link} download><i className="fa fa-download"></i></a>;
    }

    _format(name, content, link) {
        if (files.hasExtension(name, ['.json'])) {
            try {
                return JSON.stringify(JSON.parse(content), null, 4);
            } catch (e) {
                return content;
            }
        } else if (files.hasExtension(name, ['.pdf'])) {
            return <iframe src={'http://docs.google.com/gview?url=' + link + '&embedded=true'} className="file-view-iframe" frameBorder='0'></iframe>;
        } else if (files.hasExtension(name, ['.tsv', '.csv'])) {
            return (<div className="table-responsive">
                        <Table className="table table-bordered" data={this._parseTabular(name, content)}
                          sortable={true}
                          itemsPerPage={100}
                          pageButtonLimit={5} />
                    </div>);
        } else if (files.hasExtension(name, ['.nii.gz'])) {
            return <Papaya image={link} />;
        } else if (files.hasExtension(name, ['.jpg', '.jpeg', '.png', '.gif'])) {
            return <div className="modal-preview-image" ><img src={link} /></div>;
        } else {
            return content;
        }
    }

// custom methods -----------------------------------------------------

    /**
     * Parse Tabular
     *
     * Parse raw tabular data into an array of
     * objects readable by Reactable.
     */
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

        return tableData;
    }

}

// prop validation ----------------------------------------------------

FileDisplay.propTypes = {
    file: React.PropTypes.object,
    onHide: React.PropTypes.func,
    show: React.PropTypes.bool
};
