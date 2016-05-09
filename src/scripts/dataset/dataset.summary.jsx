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
                <h6>
                    <span>{files}, {size}, {subjects}, {sessions}</span><br />
                    {this._list('Tasks', summary.tasks)}<br/>
                    {this._list('Modalities', summary.modalities)}
                </h6>
            );
        }
    }

    _list(type, items) {
        if (items && items.length > 0) {
            return <span>Available {type} - {items.join(', ')}</span>;
        }
    }

}