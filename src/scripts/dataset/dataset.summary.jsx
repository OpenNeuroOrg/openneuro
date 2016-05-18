// dependencies -------------------------------------------------------

import React       from 'react';
import pluralize   from 'pluralize';
import bytes       from 'bytes';

export default class Summary extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        let summary = this.props.summary;

        return <div className="clearfix">{this._summary(summary, this.props.minimal)}</div>;
    }

// custom methods -----------------------------------------------------

    _summary(summary, minimal) {
        if (summary) {

            // // example large summary test data
            summary.totalFiles = 391;
            summary.size = 55000000;
            summary.modalities =['bold', 'inplaneT2', 'T1w'];
            summary.tasks      =['balloon analog risk task', 'discounting', 'emotional regulation', 'stop signal'];

            let numSessions = summary.sessions.length > 0 ? summary.sessions.length : 1;
            let files       = summary.totalFiles + ' ' + pluralize('File', summary.totalFiles);
            let size        = bytes(summary.size);
            let subjects    = summary.subjects.length + ' - ' + pluralize('Subject', summary.subjects.length);
            let sessions    = numSessions + ' - ' + pluralize('Session', numSessions);

            if (minimal) {
                return (
                    <div className="minimal-summary">
                        <div className="summary-data files">
                            <strong>{files}, {size}, {subjects}, {sessions}</strong>
                        </div>
                         <div className="summary-data tasks">
                            <span>{this._list(<b>Tasks</b>, summary.tasks)}</span>
                        </div>
                        <div className="summary-data modalities">
                            <span>{this._list(<b>Modalities</b>, summary.modalities)}</span>
                        </div>
                    </div>
                );
            } else {
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
    }

    _list(type, items) {
        if (items && items.length > 0) {
            return <span><b>Available</b> {type} : {items.join(', ')}</span>;
        }
    }

}

Summary.props = {
    summary: null,
    minimal: false
};

Summary.propTypes = {
    summary: React.PropTypes.object,
    minimal: React.PropTypes.bool
};