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
            activeKey: '2'
        };
    }

// life cycle events --------------------------------------------------

    componentWillReceiveProps(nextProps) {
        if (this.props.validating && !nextProps.validating) {
            if (nextProps.errors.length > 0 || nextProps.warnings.length > 0) {
                this.setState({activeKey: '1'});
            } else {
                this.setState({activeKey: '2'});
            }
        }
    }

    render () {
        let errors     = this.props.errors || [],
            warnings   = this.props.warnings || [],
            validating = this.props.validating,
            display    = this.props.display,
            invalid    = this.props.invalid;

        if (!display) {return false;}

        return (
            <div className="fade-in col-xs-12 validation">
                <h3 className="metaheader">BIDS Validation</h3>
                {this._accordion(errors, warnings, validating, invalid)}
            </div>
        );
    }

// templates methods --------------------------------------------------

    _accordion(errors, warnings, validating, invalid) {
        if (validating) {
            return <Spinner text="Validating" active={true} />;
        } else {
            return (
                <Accordion className="validation-wrap" activeKey={this.state.activeKey} onSelect={this._togglePanel.bind(this)}>
                    <Panel className="status" header={this._header(errors, warnings)} eventKey="1">
                        {this._message(errors, warnings, invalid)}<br />
                        <Results errors={errors} warnings={warnings} />
                    </Panel>
                </Accordion>
            );
        }
    }

    _header(errors, warnings) {
        let errs, warns, superValid;

        let status = errors.length ? <span className="dataset-status ds-danger"><i className="fa fa-exclamation-circle" /> Invalid</span> : <span className="dataset-status ds-success"><i className="fa fa-check-circle" /> Valid</span>;
        if (errors.length > 0) {
            errs =  <span className="label text-danger pull-right"> {errors != 'Invalid' ? errors.length +' '+ pluralize('Error', errors.length) : null}</span>;
        }
        if (warnings && warnings.length > 0) {
            warns = <span className="label text-warning pull-right">{warnings.length} {pluralize('Warning', warnings.length)}</span>;
        }
        if (warnings && warnings.length <= 0 && errors.length <= 0){
            superValid = 'super-valid';
        }
        return <div className={superValid}>{status}{errs}{warns}</div>;
    }

    _message(errors, warnings, invalid) {
        let errMessage, warnMessage;
        if (invalid) {
            errMessage = 'This does not appear to be a BIDS dataset.';
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
        let activeKey = this.state.activeKey === '1' ? '2' : '1';
        this.setState({activeKey});
    }

}

Validation.propTypes = {
    errors:     React.PropTypes.array,
    warnings:   React.PropTypes.array,
    validating: React.PropTypes.bool,
    display:    React.PropTypes.bool,
    invalid:    React.PropTypes.bool
};

Validation.props = {
    errors:     [],
    warnings:   [],
    validating: false,
    display: true,
    invalid: false
};