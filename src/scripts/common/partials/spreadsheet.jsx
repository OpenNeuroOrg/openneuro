// dependencies -------------------------------------------------------

import React from 'react';
import files from '../../utils/files';

export default class Spreadsheet extends React.Component {

// life cycle events --------------------------------------------------


    render() {

        let separator = this._separator(this.props.name);
        let rows      = this.props.content.split('\n');
        let headers   = rows[0].split(separator);
        rows.shift();

        return (
            <table>
                {this._tableHead(headers)}
                {this._tableBody(rows, separator)}
            </table>
        );
    }

// template methods ---------------------------------------------------

    _tableHead(headers) {
        let cells = headers.map((header, index) => {
            return <td key={index}>{header}</td>;
        });

        return <thead><tr>{cells}</tr></thead>;
    }

    _tableBody(content, separator) {
        let rows = content.map((row, index) => {
            if (row && !/^\s*$/.test(row)) {
                let cells = row.split(separator).map((value, index) => {
                    return <td key={index}>{value}</td>;
                });

                return <tr key={index}>{cells}</tr>;
            }
        });

        return <tbody>{rows}</tbody>;
    }

// custom methods -----------------------------------------------------

    _separator(name) {
        if (files.hasExtension(name, ['.tsv'])) {
            return '\t';
        } else if (files.hasExtension(name, ['.csv'])) {
            return ',';
        } else {
            return null;
        }
    }

}

Spreadsheet.propTypes = {
    name:    React.PropTypes.string,
    content: React.PropTypes.string
};