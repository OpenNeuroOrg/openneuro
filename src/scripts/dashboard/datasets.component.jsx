import React                    from 'react';
import moment                   from 'moment';
import {PanelGroup, Panel}  from 'react-bootstrap';
import scitran              from '../utils/scitran';
import Paginator            from '../common/partials/paginator.component.jsx';

let Datasets = React.createClass({

   getInitialState: function(){
    return {
            loading: false,
            datasets: [],
            resultsPerPage: 30,
            _page: 0
        };
   },
    componentDidMount: function() {
        let self = this;
        self.setState({loading: true})
        scitran.getProjects(function (datasets) {
            self.setState({datasets: datasets,  loading: false});
        });
    },

   render: function() {

        let self = this;
        let datasets = this.state.datasets;
        let spinner = (
            <div className="loading-wrap fadeIn">
                <div className="spinner">
                    <div className="spinnerinner"></div>
                </div>
                <span>Loading</span>
            </div>
        );      
        if(datasets.length > 0){
            var pagesTotal = Math.ceil(datasets.length / this.state.resultsPerPage);
            // paginate the full set of results in this.props.results
            let paginatedResults = this.paginate(datasets, this.state.resultsPerPage, this.state._page);     
            // map results
            var Results = paginatedResults.map(function (dataset, index){       
                let dateAdded = moment(dataset.timestamp).format('L');
                let timeago = moment(dataset.timestamp).fromNow(true)
                let datasetheader =(
                <div className="header clearfix">
                    <h4 className="dataset">{dataset.name}</h4>
                    <div className="date">{dateAdded}<span className="time-ago">{timeago}</span></div>
                </div>
                );
                return (
                <Panel className="fadeIn" header={datasetheader} eventKey={dataset._id} key={index}>
                    <div className="inner">
                        {dataset.name} - {index}
                    </div>
                </Panel>
                );
            });
        }
         // display it
        return (
        	<div className="fadeIn">
        	<div className="dash-tab-content datasets ">
             
                <h2>My Datasets</h2>
                <PanelGroup accordion> 
                    {this.state.loading ? spinner : Results} 
                </ PanelGroup>
                    </div>
                                                    <Paginator
                    page={this.state._page}
                    pagesTotal={pagesTotal}
                    pageRangeDisplayed={5}
                    activePageRangeDisplayed={0}
                    prevLabel="«"                            
                    nextLabel="»" 
                    containerClass="pagination"
                    onPageSelect={this.onPageSelect} />
             </div>
        );

    },
        paginate: function(data, perPage, _page){
            // if we got no data -> return empty array
            if(data.length < 1) return null;
            // define _page
            var _page = (_page) ? _page : this.state._page;
            // define the start
            var start = (_page * perPage);
            var end = start + perPage;

            // only get the last data in there
            var retArr = data.slice(start, end);
            // return the array
            return retArr;
       },


      onPageSelect: function(_page, clickEvent){
            // change _page state
            let pageNumber = Number(_page);
            this.setState({ _page: pageNumber });
       }
});

export default Datasets;