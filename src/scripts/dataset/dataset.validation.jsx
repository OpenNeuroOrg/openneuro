// dependencies -------------------------------------------------------

import React        from 'react';
import Spinner      from '../common/partials/spinner.jsx';
import { Accordion, Panel } from 'react-bootstrap';
import pluralize    from 'pluralize';
import Results      from '../upload/upload.validation-results.jsx';

export default class Validation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: "2"
        };
    }

// life cycle events --------------------------------------------------

    componentWillReceiveProps(nextProps) {
        if (this.props.validating && !nextProps.validating) {
            if (nextProps.errors.length > 0 || nextProps.warnings.length > 0) {
                this.setState({activeKey: "1"});
            } else {
                this.setState({activeKey: "2"});
            }
        }
    }

    render () {
        let temp = false;
        let errors     = this.props.errors,
            warnings   = this.props.warnings,
            validating = this.props.validating;

        if (validating) {
            return (
                <div className="fade-in col-xs-12 analyses">
                    <h3 className="metaheader">Validation</h3>
                    <Spinner text="Validating" active={true} />
                </div>
            );
        }

        let header = errors.length > 0 ? 'Invalid' : (warnings.length > 0 ? 'Warnings' : 'Valid');

        return (
            <div className="fade-in col-xs-12 analyses">
                <h3 className="metaheader">Validation</h3>
                <Accordion className="jobs-wrap" activeKey={this.state.activeKey}>
                    <Panel className="job" header={this._header(errors, warnings)} eventKey="1" onClick={this._togglePanel.bind(this)}>
                        {this._message(errors, warnings)}<br />
                        <Results errors={errors} warnings={warnings} />
                    </Panel>
                </Accordion>
            </div>
        );
    }

// templates methods --------------------------------------------------

    _header(errors, warnings) {
        let errs, warns;
        let status = errors.length ? <span className="dataset-status ds-danger"><i className="fa fa-exclamation-circle" /> Invalid</span> : <span className="dataset-status ds-success"><i className="fa fa-check-circle" /> Valid</span>;
        if (errors.length > 0) {
            errs =  errors.length + ' ' + pluralize('Error', errors.length);
        }
        if (warnings.length > 0) {
            warns = warnings.length + ' ' + pluralize('Warning', warnings.length);
            if (errs) {warns = ', ' + warns;}
        }
        return <div>{status}{errs || warns ? ' - ' : null}{errs}{warns}</div>;
    }

    _message(errors, warnings) {
        let errMessage, warnMessage;
        if (errors === 'Invalid') {
            errMessage = 'This does not appear to be a BIDS dataset';
        } else {
            if (errors.length > 0) {
                errMessage = <span className="message error fade-in">Your dataset is no longer valid. You must fix the <strong>{errors.length + ' ' + pluralize('Error', errors.length)}</strong> to use all of the site features.</span>;
            }
            if (warnings.length > 0) {
                warnMessage = <span className="message error fade-in">We found <strong>{warnings.length + ' ' + pluralize('Warning', warnings.length)}</strong> in your dataset. You are not required to fix warnings, but doing so will make your dataset more BIDS compliant.</span>;
            }
        }
        if (errMessage || warnMessage) {
            return <div>{errMessage} {warnMessage}</div>;
        }
    }

// actions ------------------------------------------------------------

    _togglePanel() {
        if (this.props.errors.length === 0 && this.props.warnings.length === 0) {return;}
        let activeKey = this.state.activeKey === "1" ? "2" : "1";
        this.setState({activeKey});
    }

}

Validation.propTypes = {
    errors:     React.PropTypes.array,
    warnings:   React.PropTypes.array,
    validating: React.PropTypes.bool
};

Validation.props = {
    errors:     [],
    warnings:   [],
    validating: false
}