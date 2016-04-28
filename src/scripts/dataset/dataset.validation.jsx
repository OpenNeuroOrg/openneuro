// dependencies -------------------------------------------------------

import React        from 'react';
import Spinner      from '../common/partials/spinner.jsx';
import { Accordion, Panel } from 'react-bootstrap';
import pluralize    from 'pluralize';
import Results      from '../upload/upload.validation-results.jsx';

export default class Validation extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        let temp = false;
        let errors     = this.props.errors,
            warnings   = this.props.warnings,
            validating = this.props.validating;

        if (validating) {
            return <Spinner text="Validating" active={true} />;
        }
        if (errors.length > 0 || warnings.length > 0) {
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
            temp = (
                <div className="fade-in col-xs-12">
                    <h3 className="metaheader">Validation</h3>
                    <div>{errMessage} {warnMessage}</div><br />
                    <Results errors={errors} warnings={warnings} />
                </div>
            );
        }
        return temp;
    }

// templates methods --------------------------------------------------



}