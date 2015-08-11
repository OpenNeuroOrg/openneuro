// dependencies ------------------------------------------------------------------------------

import React                from 'react';
import moment               from 'moment';
import {PanelGroup, Panel}  from 'react-bootstrap';
import scitran              from '../utils/scitran';
import Paginator            from '../common/partials/paginator.component.jsx';
import Spinner              from '../common/partials/spinner.component.jsx';
import FileTree             from '../upload/upload.file-tree.jsx';

// component setup ---------------------------------------------------------------------------

export default class Datasets extends React.Component {

    constructor() {
        super();
	    this.state = {
            loading: false,
            datasets: [],
            resultsPerPage: 30,
            page: 0,
        };
    }

// life cycle events -------------------------------------------------------------------------

    componentDidMount() {
        let self = this;
        self.setState({loading: true})
        scitran.getProjects(function (datasets) {
            datasets.reverse();
            self.setState({datasets: datasets,  loading: false});
        });
    }

    render() {
        let self = this;
        let datasets = this.state.datasets;

        if (datasets.length > 0) {
            var pagesTotal = Math.ceil(datasets.length / this.state.resultsPerPage);
            let paginatedResults = this.paginate(datasets, this.state.resultsPerPage, this.state.page);   

            // map results
            var Results = paginatedResults.map(function (dataset, index){       
                let dateAdded = moment(dataset.timestamp).format('L');
                let timeago   = moment(dataset.timestamp).fromNow(true)
                
                let datasetheader = (
                    <div className="header clearfix" onClick={self.loadDataTree.bind(self, dataset)}>
                        <h4 className="dataset">{dataset.name}</h4>
                        <div className="date">{dateAdded}<span className="time-ago">{timeago}</span></div>
                    </div>
                );
                let hideDeleteBtn = (
                	<div className="btn-group slideInRightFast" role="group" >
                		<button className="btn btn-admin cancel" onClick={self._dismissDelete.bind(self, dataset)}>Cancel</button>
                		<button className="btn btn-admin delete" onClick={self.deleteProject.bind(self, dataset)}>Yes Delete!</button>
                	</div>
                )
                let viewdeleteBtn = (
                	<div className=" fadeIn" >
                		 <button className="btn btn-admin warning" onClick={self._showDelete.bind(self, dataset)}>Delete this dataset <i className="fa fa-trash-o"></i> </button>
                	</div>
                )
                return (
                    <Panel className="fadeIn " header={datasetheader} eventKey={dataset._id} key={index}>
                        <div className="inner">
                            {!dataset.isLoading ? <FileTree tree={dataset.tree} /> : null}
                        	<Spinner text={dataset.loadingAction + ' ' + dataset.name} active={dataset.isLoading} />
                        </div>
                        <div className="inner-right delete-data">
                            {dataset.showDeleteBtn ? hideDeleteBtn : viewdeleteBtn}
                        </div>
                    </Panel>
                );
            });
        }

        let noDatasets = "You don't have any datsets.";
        return (
        	<div className="fadeIn">
            	<div className="dash-tab-content datasets ">
                    <h2>My Datasets</h2>
                    <PanelGroup accordion> 
                        {this.state.loading ? <Spinner active={true} /> : Results}
                        {datasets.length === 0 ? <p>{noDatasets}</p> : null}
                    </ PanelGroup>
                </div>
                <div className="pager-wrapper">
                	<Paginator
	                    page={this.state.page}
	                    pagesTotal={pagesTotal}
	                    pageRangeDisplayed={5}
	                    onPageSelect={this.onPageSelect.bind(self)} />
            	</div>
            </div>
        );
    }

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
	}

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
    }

    paginate(data, perPage, page) {
        if (data.length < 1) return null;
        let page = (page) ? page : this.state.page;
        let start = (page * perPage);
        let end = start + perPage;
        var retArr = data.slice(start, end);
        return retArr;
    }

    onPageSelect(page, e) {
        let pageNumber = Number(page);
        this.setState({ page: pageNumber });
    }

    _showDelete(dataset){
    	let self = this,
    		datasets = this.state.datasets,
  			datasetIndex;
        for (var i = 0; i < self.state.datasets.length; i++) {
            if (dataset._id === self.state.datasets[i]._id) {
                datasets[i].showDeleteBtn = true;
                self.setState({datasets: datasets});
                datasetIndex = i;
            }else{
            	datasets[i].showDeleteBtn = false;
            }
        }
    }
    
    _dismissDelete(dataset){
    	let self = this,
    		datasets = this.state.datasets,
  			datasetIndex;
        for (var i = 0; i < self.state.datasets.length; i++) {
            if (dataset._id === self.state.datasets[i]._id) {
                datasets[i].showDeleteBtn = false;
                self.setState({datasets: datasets});
                datasetIndex = i;
            }
        }
    }

}