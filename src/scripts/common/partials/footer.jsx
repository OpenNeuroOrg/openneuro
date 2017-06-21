// dependencies -------------------------------------------------------

import React       from 'react';
import packageJson from '../../../../package.json';


let Footer = React.createClass({

// life cycle events --------------------------------------------------

    render () {

        return (
            <span>
            <footer>
                <div className="row">
                    <div className="col-xs-12 col-md-4 version">
                        <span>OpenNeuro Beta v.{packageJson.version}</span>
                    </div>
                    <div className="col-xs-12 col-md-4 footer-menu">
                    </div>
                    <div className="col-xs-12 col-md-4 copy">
                        <span>&copy; 2017 Stanford Center for Reproducible Neuroscience</span>
                    </div>
                </div>
            </footer>
            </span>
        );
    }
});

export default Footer;
