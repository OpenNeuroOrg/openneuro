// dependencies ------------------------------------------------------------------------------

import React from 'react';

// component setup ---------------------------------------------------------------------------

export default class Paginator extends React.Component {

// life cycle events -------------------------------------------------------------------------

    render() {
        let self       = this,
            page       = this.props.page,
            breakLabel = this.props.breakLabel;

        // generate page buttons
        let pageArr = this.createPageArr();
        let Pages   = pageArr.map(function(p, i) {
            if (p == 'break') return ( <li key={'pgn'+ p +'-'+ i}><span>{breakLabel}</span></li> );

            // display page number
            if (page != p) {
                return (
                    <li key={'pgn'+ p +'-'+ i}>
                        <a href="#" data-page={p} onClick={self.onPageSelect.bind(self)}>
                            {(p + 1)}
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={'pgn'+ p +'-'+ i} className="active">
                        <span>{(p + 1)}</span>
                    </li>
                );
            }
        });

        // conditionally create previous button
        let prevBtn;
        if (this.props.prevLabel != false && page != 0) {
            prevBtn = (
                <li key="pgn-prev">
                    <a href="#" data-page={(page - 1)} onClick={self.onPageSelect.bind(self)}>
                        {this.props.prevLabel}
                    </a>
                </li>
            );
        }

        // conditionally create next button
        let nextBtn;
        if (this.props.nextLabel != false && page != this.props.pagesTotal - 1) {
            nextBtn = (
                <li key="pgn-next">
                    <a href="#" data-page={(page + 1)} onClick={self.onPageSelect.bind(self)}>
                        {this.props.nextLabel}
                    </a>
                </li>
            );
        }

        return (
            <ul className={this.props.containerClass}>
                {prevBtn}
                {pageArr.length > 1 ? Pages   : null}
                {pageArr.length > 1 ? nextBtn : null}
            </ul>
        );
    }


// custom methods ----------------------------------------------------------------------------

    onPageSelect(e) {
        // get the selected page
        var thePage = e.currentTarget.getAttribute('data-page');
        // call props function
        if(this.props.onPageSelect) this.props.onPageSelect(thePage, e);
        // prevent Default
        e.preventDefault();
    }


    createPageArr() {

        var pageArr = [];

        if (this.props.pagesTotal <= this.props.pageRangeDisplayed) {
            let arr = [];
            for (let i = 0; i < this.props.pagesTotal; i++) {
                arr.push(i);
            }
            return arr;
        } else {

            // shortcut all
            var pagesTotal = this.props.pagesTotal,
                page = parseInt(this.props.page),
                activePageRangeDisplayed = parseInt(this.props.activePageRangeDisplayed),
                pageRangeDisplayed = this.props.pageRangeDisplayed,
                activeRangeStart = (page - activePageRangeDisplayed),
                activeRangeEnd = page + activePageRangeDisplayed,
                lastRange = (pagesTotal - pageRangeDisplayed),
                lastI = 0,
                currentI = 0;


            // walk through all pages and formulate them
            for (var i = 0; i < pagesTotal; i++) {
                if (
                    // if this page is one of the starting pages
                    i < pageRangeDisplayed ||
                    // else if the page is within the active range
                    (i >= activeRangeStart && i <= activeRangeEnd) ||
                    // or if page is at the end
                    (i >= lastRange)
                ) { currentI = i; }

                // else add a break
                else {currentI = 'break';}


                // if we haven't just used a break and this one is too -> add the current I
                if (lastI == 'break' && currentI == 'break') {
                    continue;
                } else {
                    pageArr.push(currentI);
                }

                // set the last i
                lastI = currentI;
            }

            return pageArr;
        }
    }

}

// props -------------------------------------------------------------------------------------

Paginator.propTypes = {
    page:                     React.PropTypes.number.isRequired,
    pagesTotal:               React.PropTypes.number.isRequired,
    pageRangeDisplayed:       React.PropTypes.number,
    activePageRangeDisplayed: React.PropTypes.number,
    prevLabel:                React.PropTypes.string,
    nextLabel:                React.PropTypes.string,
    breakLabel:               React.PropTypes.string,
    containerClass:           React.PropTypes.string,
    onPageSelect:             React.PropTypes.func
};

Paginator.defaultProps = {
    page:                     0,
    pagesTotal:               0,
    pageRangeDisplayed:       1,
    activePageRangeDisplayed: 1,
    prevLabel:                '«',
    nextLabel:                '»',
    breakLabel:               '...',
    containerClass:           'pagination'
};