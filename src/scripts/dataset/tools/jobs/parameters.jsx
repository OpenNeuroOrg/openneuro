import React from 'react';

const JobParameters = ({parameters, onChange, onRestoreDefaults}) => {

    if (Object.keys(parameters).length === 0) {return <noscript />;}

    const parameterInputs = Object.keys(parameters).map((parameter) => {
        return (
            <div key={parameter}>
                <div className="parameters form-horizontal">
                    <div className="form-group" key={parameter}>
                        <label className="sr-only">{parameter}</label>
                        <div className="input-group">
                            <div className="input-group-addon">{parameter}</div>
                            <div className="clearfix">
                                <input className="form-control"
                                       value={parameters[parameter]}
                                       onChange={onChange.bind(null, parameter)}/>
                                <span className="help-text">{parameter}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div>
            <br /><hr /><br />
            <div className="row">
                <div className="col-xs-6">
                    <h5>Parameters</h5>
                </div>
                <div className="col-xs-6 default-reset">
                    <button className="btn-reset" onClick={onRestoreDefaults}>Restore Default Parameters</button>
                </div>
            </div>
            {parameterInputs}
        </div>
    );

};

JobParameters.propTypes = {
    onChange: React.PropTypes.func,
    onRestoreDefaults: React.PropTypes.func,
    parameters: React.PropTypes.object
};

JobParameters.defaultProps = {
    parameters: {}
};

export default JobParameters;