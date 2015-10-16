// dependencies ------------------------------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import Actions       from './datasets.actions.js';
import DatasetsStore from './datasets.store.js';
import {State, Link} from 'react-router';
import moment        from 'moment';
import {PanelGroup}  from 'react-bootstrap';
import Paginator     from '../common/partials/paginator.jsx';
import Spinner       from '../common/partials/spinner.jsx';
import Statuses      from '../dataset/dataset.statuses.jsx';
import Filters       from './datasets.filters.jsx';

// component setup ---------------------------------------------------------------------------

let Datasets = React.createClass({

    mixins: [State, Reflux.connect(DatasetsStore)],

// life cycle events -------------------------------------------------------------------------

    componentDidMount() {
        let isPublic = this.getPath().indexOf('dashboard') === -1;
        this.setState({isPublic});
        Actions.getDatasets(isPublic);
    },

    render() {
        let self     = this;
        let datasets = this.state.datasets;
        let isPublic  = this.state.isPublic;
        let results;

        if (datasets.length === 0) {
            let noDatasets = "You don't have any datasets.";
            results = <p className="no-datasets">{noDatasets}</p>;
        } else {
            var pagesTotal = Math.ceil(datasets.length / this.state.resultsPerPage);
            let paginatedResults = this._paginate(datasets, this.state.resultsPerPage, this.state.page);

            // map results
            results = paginatedResults.map(function (dataset, index){
                let dateAdded    = moment(dataset.timestamp).format('L');
                let timeago      = moment(dataset.timestamp).fromNow(true);

                return (
                    <div className="fadeIn  panel panel-default" key={dataset._id}>
                        <div className="panel-heading">
                            <div className="header clearfix">
                                <Link to="dataset" params={{datasetId: dataset._id}}>
                                    <h4 className="dataset">
                                        {dataset.name}
                                        <Statuses dataset={dataset} />
                                    </h4>
                                    <div className="date">{dateAdded}<span className="time-ago">{timeago}</span></div>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            });
        }

        return (
        	<div className={isPublic ? "fadeIn public-dashboard inner-route" : "fadeIn"}>
            	<div className="dash-tab-content datasets ">
                    <h2>{isPublic ? 'Public Datasets' : 'My Datasets'}</h2>
                    <Filters sort={this.state.sort}/>
                    <PanelGroup>
                        {this.state.loading ? <Spinner active={true} /> : results}
                    </ PanelGroup>
                </div>
                <div className="pager-wrapper">
                	<Paginator
	                    page={this.state.page}
	                    pagesTotal={pagesTotal}
	                    pageRangeDisplayed={5}
	                    onPageSelect={this._onPageSelect} />
            	</div>
            </div>
        );
    },

// custom methods ----------------------------------------------------------------------------

    _paginate(data, perPage, page) {
        if (data.length < 1) return null;
        let page = (page) ? page : this.state.page;
        let start = (page * perPage);
        let end = start + perPage;
        var retArr = data.slice(start, end);
        return retArr;
    },

    _onPageSelect(page, e) {
        let pageNumber = Number(page);
        this.setState({ page: pageNumber });
    },

    _sort(value, direction) {
        Actions.sort(value, direction);
    }

});

export default Datasets;