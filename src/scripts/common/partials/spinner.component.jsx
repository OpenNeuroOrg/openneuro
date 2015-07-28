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
                <span>Loading</span>
            </div>
        );
    }

}

// export default Spinner;