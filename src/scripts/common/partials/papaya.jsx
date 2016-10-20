/*eslint-disable no-unused-vars*/
/* global papaya, papayaContainers */

// dependencies -------------------------------------------------------

import React from 'react';

export default class Papaya extends React.Component {

// life cycle events --------------------------------------------------

    constructor() {
        super();
        this.state = {
            papayaWidth: this._calculateWidth()
        };
    }

    componentDidMount () {
        // clear any old containers
        papayaContainers = [];

        let params = {
            worldSpace: true,
            fullScreen: false,
            allowScroll: false,
            fullScreenPadding: false,
            showControlBar: true,
            images: [this.props.image],
            kioskMode: true
        };

        // rebuild container
        papaya.Container.startPapaya();

        // start viewer
        papaya.Container.resetViewer(0, params);

        // listen to window resizes
        window.addEventListener('resize', this._updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._updateDimensions.bind(this));
    }

    render() {
        return (
            <div className="papaya-wrap" style={{width: this.state.papayaWidth + 'px'}}><div className="papaya"></div></div>
        );
    }

// custom methods -----------------------------------------------------

    _calculateWidth() {
        let windowHeight  = window.innerHeight;
        let headerHeight  = 90;
        let contentHeight = windowHeight - headerHeight;

        // estimate papaya viewer size ratio
        let denominator;
        if (windowHeight > 1150)     {denominator = 3;}
        else if (windowHeight > 800) {denominator = 3.2;}
        else if (windowHeight > 640) {denominator = 3.4;}
        else if (windowHeight > 540) {denominator = 3.6;}
        else if (windowHeight > 480) {denominator = 3.8;}
        else if (windowHeight > 400) {denominator = 4;}
        else if (windowHeight > 0) {denominator = 4.2;}

        let viewerWidth   = contentHeight * 4 / denominator;
        return viewerWidth;
    }

    _updateDimensions() {
        this.setState({papayaWidth: this._calculateWidth()});
    }
}

// prop validation ----------------------------------------------------

Papaya.propTypes= {
    image: React.PropTypes.string
};