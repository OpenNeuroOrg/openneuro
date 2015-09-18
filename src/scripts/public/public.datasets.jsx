// dependencies ------------------------------------------------------------------------------

import React                from 'react';
import Reflux               from 'reflux';
import {Link}               from 'react-router';
import moment               from 'moment';
import {PanelGroup}  from 'react-bootstrap';
import request              from '../utils/request';
import Paginator            from '../common/partials/paginator.component.jsx';
import Spinner              from '../common/partials/spinner.component.jsx';
import FileTree             from '../upload/upload.file-tree.jsx';

// component setup ---------------------------------------------------------------------------

let Datasets = React.createClass({

// life cycle events -------------------------------------------------------------------------

    getInitialState() {
        return {
            loading: false,
            datasets: [],
            resultsPerPage: 30,
            page: 0
        }
    },
    
    componentDidMount() {
        this._getDatasets();
    },

    render() {
        let self     = this;
        let datasets = this.state.datasets;
        let results;

        if (datasets.length === 0) {
            let noDatasets = "There are no datasets.";
            results = <p className="no-datasets">{noDatasets}</p>;
        } else {
            var pagesTotal = Math.ceil(datasets.length / this.state.resultsPerPage);
            let paginatedResults = this.paginate(datasets, this.state.resultsPerPage, this.state.page);   

            // map results
            results = paginatedResults.map(function (dataset, index){
                let dateAdded = moment(dataset.timestamp).format('L');
                let timeago   = moment(dataset.timestamp).fromNow(true);
                
                let datasetheader = (
                    <div className="header clearfix">
                        <Link to="dataset" params={{datasetId: dataset._id}}>
                            <h4 className="dataset">
                               {dataset.name} 
                            </h4>
                            <div className="date">{dateAdded}<span className="time-ago">{timeago}</span></div>
                        </Link>
                    </div>
                );

                return (
                    <div className="fadeIn  panel panel-default">
                        <div className="panel-heading">
                            {datasetheader}
                        </div>
                    </div>
                );
            });
        }

        return (
        	<div className="fadeIn inner-route public-dashboard">
                <div className="dash-tab-content datasets ">
                    <h2>Public Datasets</h2>
                    <PanelGroup> 
                        {this.state.loading ? <Spinner active={true} /> : results}
                    </ PanelGroup>
                </div>
                <div className="pager-wrapper">
                	<Paginator
	                    page={this.state.page}
	                    pagesTotal={pagesTotal}
	                    pageRangeDisplayed={5}
	                    onPageSelect={this.onPageSelect} />
            	</div>
            </div>
        );
    },

// custom methods ----------------------------------------------------------------------------
    
    _getDatasets() {
        let self = this;
        self.setState({loading: true});
        request.get('projects', {auth: false}, function (err, res) {
            let datasets = res.body;
            datasets.reverse();
            self.setState({datasets: datasets,  loading: false});
        });
    },

    paginate(data, perPage, page) {
        if (data.length < 1) return null;
        let page = (page) ? page : this.state.page;
        let start = (page * perPage);
        let end = start + perPage;
        var retArr = data.slice(start, end);
        return retArr;
    },

    onPageSelect(page, e) {
        let pageNumber = Number(page);
        this.setState({ page: pageNumber });
    }

});

export default Datasets;