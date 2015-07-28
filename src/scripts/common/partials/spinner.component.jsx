// dependencies ------------------------------------------------------------------------------

import React from 'react';

// component setup ---------------------------------------------------------------------------

export default class Spinner extends React.Component {

// life cycle events -------------------------------------------------------------------------

    render() {
        return (
            <div className="loading-wrap fadeIn">
                <div className="spinner">
                    <div className="spinnerinner"></div>
                </div>
                <span>{this.props.text}</span>
            </div>
        );
    }

}

Spinner.propTypes = {
    text: React.PropTypes.string
};

Spinner.defaultProps = {
    text: 'Loading'
};