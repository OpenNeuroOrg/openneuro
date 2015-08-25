// dependencies ------------------------------------------------------------------------------

import React                from 'react';
import Reflux               from 'reflux';
import Actions              from './datasets.actions.js';
import DatasetsStore        from './datasets.store.js';
import {Link}               from 'react-router';
import moment               from 'moment';
import {PanelGroup, Panel}  from 'react-bootstrap';
import scitran              from '../utils/scitran';
import Paginator            from '../common/partials/paginator.component.jsx';
import Spinner              from '../common/partials/spinner.component.jsx';
import FileTree             from '../upload/upload.file-tree.jsx';
import WarnButton           from '../common/forms/warn-button.component.jsx'; 

// component setup ---------------------------------------------------------------------------

let Datasets = React.createClass({
    
    mixins: [Reflux.connect(DatasetsStore)],

// life cycle events -------------------------------------------------------------------------

    getInitialState() {
        return {
            loading: false,
            datasets: [],
            resultsPerPage: 30,
            page: 0,
        };
    },

    componentDidMount() {
        let self = this;
        self.setState({loading: true})
        scitran.getProjects(function (datasets) {
            datasets.reverse();
            self.setState({datasets: datasets,  loading: false});
        });
    },

    render() {
        let self     = this;
        let datasets = this.state.datasets;
        let results;

        if (datasets.length === 0) {
            let noDatasets = "You don't have any datasets.";
            results = <p className="no-datasets">{noDatasets}</p>;
        } else {
            var pagesTotal = Math.ceil(datasets.length / this.state.resultsPerPage);
            let paginatedResults = this.paginate(datasets, this.state.resultsPerPage, this.state.page);   

            // map results
            results = paginatedResults.map(function (dataset, index){
                let dateAdded = moment(dataset.timestamp).format('L');
                let timeago   = moment(dataset.timestamp).fromNow(true)
                
                let datasetheader = (
                    <div className="header clearfix" onClick={self.loadDataTree.bind(null, dataset)}>
                        <h4 className="dataset">{dataset.name}</h4>
                        <div className="date">{dateAdded}<span className="time-ago">{timeago}</span></div>
                    </div>
                );

                return (
                    <Panel className="fadeIn " header={datasetheader} eventKey={dataset._id} key={dataset._id}>
                        <div className="inner">
                            {!dataset.isLoading ? "area for future content" : null}
                        	<Spinner text={dataset.loadingAction + ' ' + dataset.name} active={dataset.isLoading} />
                        </div>
                        <div className="inner-right">
                            <div className="row">
                                <div className="col-xs-6 left">
                                    <Link to="dataset" params={{datasetId: dataset._id}}>View dataset page »</Link>
                                </div>
                                <div className="col-xs-6 right  delete-data">
                                    <WarnButton message="Delete this dataset" action={self.deleteProject.bind(null, dataset)} />
                                </div>
                            </div>
                        </div>
                    </Panel>
                );
            });
        }

        return (
        	<div className="fadeIn">
            	<div className="dash-tab-content datasets ">
                    <h2>My Datasets</h2>
                    <PanelGroup accordion> 
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

	deleteProject(dataset) {
		let self = this,
            datasets = this.state.datasets,
            datasetIndex;
        for (var i = 0; i < self.state.datasets.length; i++) {
            if (dataset._id === datasets[i]._id) {
                datasets[i].isLoading = true;
                datasets[i].loadingAction = 'deleting';
                self.setState({datasets: datasets});
                datasetIndex = i;
            }
        }
		scitran.deleteDataset(dataset._id, function () {
            datasets.splice(datasetIndex, 1);
            self.setState({
            	datasets: datasets, 
            });
		});
	},

    loadDataTree(dataset) {
        let self = this;
        let datasets = this.state.datasets;
        for (let i = 0; i < datasets.length; i++) {
            if (dataset._id === datasets[i]._id && !datasets[i].tree) {
                datasets[i].isLoading = true;
                datasets[i].loadingAction = 'loading';
                self.setState({datasets: datasets});
                scitran.getBIDSDataset(dataset._id, function (tree) {
                    datasets[i].tree = tree;
                    datasets[i].isLoading = false;
                    datasets[i].loadingAction = null;
                    self.setState({datasets: datasets});
                });
            }
        }
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