// dependencies -------------------------------------------------------

import React       from 'react';
import pluralize   from 'pluralize';
import bytes       from 'bytes';

export default class Summary extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        let summary = this.props.summary;

        return (
            <div>
                {this._summary(summary)}
            </div>
        );
    }

// custom methods -----------------------------------------------------

    _summary(summary) {
        if (summary) {
            let numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1;
            let files       = summary.totalFiles + ' ' + pluralize('File', summary.totalFiles);
            let size        = bytes(summary.size);
            let subjects    = summary.subjects.length + ' - ' + pluralize('Subject', summary.subjects.length);
            let sessions    = numSessions + ' - ' + pluralize('Session', numSessions);

            return (
                <div>
                    <hr/>
                    <h5><b>{files}, {size}, {subjects}, {sessions}</b></h5>
                    <h5>{this._list(<b>Tasks</b>, summary.tasks)}</h5>
                    <h5>{this._list(<b>Modalities</b>, summary.modalities)}</h5>
                </div>
            );
        }
    }

    _list(type, items) {
        if (items && items.length > 0) {
            return <span><b>Available</b> {type} : {items.join(', ')}</span>;
        }
    }

}