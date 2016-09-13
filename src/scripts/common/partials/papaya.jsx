/*eslint-disable no-unused-vars*/
/* global papaya, papayaContainers */

// dependencies -------------------------------------------------------

import React from 'react';

export default class Papaya extends React.Component {

// life cycle events --------------------------------------------------

    componentDidMount () {
        // clear any old containers
        papayaContainers = [];

        let params = {
            worldSpace: true,
            fullScreen: false,
            allowScroll: false,
            fullScreenPadding: false,
            images: [this.props.image],
            kioskMode: true
        };

        // rebuild container
        papaya.Container.startPapaya();

        // start viewer
        papaya.Container.resetViewer(0, params);
    }

    render() {
        return (
            <div className="papaya"></div>
        );
    }
}

// prop validation ----------------------------------------------------

Papaya.propTypes= {
    image: React.PropTypes.string
};