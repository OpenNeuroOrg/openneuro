// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import FileDisplay from '../dataset/dataset.file-display.jsx';
import FPStore     from './front-page.store.js';
import FPActions   from './front-page.actions.js';
import Select      from 'react-select';
import Run         from '../dataset/dataset.jobs.run.jsx';
import {Link}      from 'react-router';
import {Panel}     from 'react-bootstrap';
import pluralize   from 'pluralize';
import Spinner     from '../common/partials/spinner.jsx';

// component setup ----------------------------------------------------

let Pipelines = React.createClass({

    mixins: [Reflux.connect(FPStore)],

// life cycle events --------------------------------------------------

    render() {
        return(
            <span>
                <div className="browse-pipelines">
                 <h3 className="browse-pipeline-header">Check Out Our Pipelines</h3>
                    <div className="container">
                        {this._pipelines()}
                    </div>
                </div>
                {!this.state.selectedPipeline.id ? null : this._pipelineDetail(this.state.selectedPipeline)}
                <FileDisplay
                    file={this.state.displayFile}
                    show={this.state.displayFile.show}
                    onHide={FPActions.hideFileDisplay} />
            </span>
        );
    },

// template methods ---------------------------------------------------

    _pipelines() {
        return (
            <div className="row">
                {this._featured()}
                {this._browse()}
            </div>
        );
    },

    _featured() {
        return (
            <div className="col-sm-6 mate-slide">
                <h4>Featured</h4>
                <ul>
                    <li>
                        <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-bare-0.8.7')}>mriqc-bare</button>
                    </li>
                    <li>
                        <button onClick={FPActions.selectPipeline.bind(null, 'bids-example-0.0.6')}>bids-example</button>
                    </li>
                    <li>
                        <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-bare-0.8.7')}>mriqc-bare</button>
                    </li>
                    <li>
                        <button onClick={FPActions.selectPipeline.bind(null, 'bids-example-0.0.6')}>bids-example</button>
                    </li>
                </ul>
            </div>
        );
    },

    _browse() {
        if (this.state.apps.length < 1) {
            return <div className="col-sm-6 mate-slide loading-browse"><Spinner active={true} text="Loading Pipelines" /></div>;
        }

        let pipelineOptions = this._pipelineOptions(this.state.apps, this.state.selectedTags);
        return (
            <div className="col-sm-6 mate-slide browse fade-in">
                <h4>Browse Our Collection</h4>
                <form>
                    <label>What kinds of pipelines are you interested in?</label>
                    <Select multi simpleValue value={this.state.selectedTags} placeholder="All Tags" options={this.state.tags} onChange={FPActions.selectTag} />
                    <br />
                    <label>Browse {pipelineOptions.length} {pluralize('pipeline', pipelineOptions.length)}</label>
                    <span className="select-pipeline">
                        <select value={this.state.selectedPipeline.id} onChange={this._selectPipeline}>
                            <option value="" disabled>Select a Pipeline</option>
                            {pipelineOptions}
                        </select>
                        <span className="select-pipeline-arrow"></span>
                    </span>
                </form>
            </div>
        );
    },

    _pipelineDetail(pipeline) {
        let longDescription = JSON.parse(pipeline.longDescription);
        return (
            <div className="selected-pipeline fade-in">
                <div className="container slide-in-down">
                <span className="active-pipeline-arrow"></span>
                    <div className="row">
                        <div className="col-sm-6 mate-slide">
                            <a href="#" className="close-selected" onClick={FPActions.selectPipeline.bind(null, '')}>X CLOSE</a>
                            <h2>{pipeline.name}</h2>
                            <p>{longDescription.description}</p>
                            <h4>Acknowledgments</h4>
                            <p>{longDescription.acknowledgments}</p>
                            <h4>Support</h4>
                            <p><a href={pipeline.longDescription.support}>{longDescription.support}</a></p>
                            <h4>Help</h4>
                            <p><a href={pipeline.helpURI}>{pipeline.helpURI}</a></p>
                        </div>
                        {this._exampleResults()}
                    </div>
                </div>
            </div>
        );
    },

    _exampleResults() {
        if (this.state.loadingJob) {
            return <div className="col-sm-6 mate-slide"><Spinner active={true} text="Loading Analyses" /></div>;
        }

        let exampleJob = this.state.exampleJob;
        if (!exampleJob) {
            return <div className="col-sm-6 mate-slide analyses no-jobs"><h2>No example results available.</h2></div>;
        }
        let analysisLink = (
            <span>
                <Link to="snapshot" params={{datasetId: exampleJob.datasetId, snapshotId: exampleJob.snapshotId}} query={{app: exampleJob.appId}}>
                {exampleJob.appLabel + ' - v' + exampleJob.appVersion}
                </Link>
            </span>
        );

        return (
            <div className="col-sm-6 mate-slide analyses">
                <div className="row">
                    <div className="col-sm-6 mate-analyses-header">
                        <h2>Example Analysis</h2>
                        <span>from dataset {exampleJob.datasetLabel}</span>
                    </div>
                    <div className="col-sm-6 ">
                        <a className="explore-more pull-right" href="#"><i className="fa fa-area-chart" ></i> Explore More</a>
                    </div>
                </div>
                <Panel className="jobs" header={analysisLink} eventKey={exampleJob.appId}>
                    <Run run={exampleJob}
                         toggleFolder={FPActions.toggleFolder}
                         displayFile={FPActions.displayFile} />
                </Panel>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _tagOptions(tags) {
        return tags.map((tag) => {
            return <option value={tag} key={tag}>{tag}</option>;
        });
    },

    _selectPipeline(e) {
        FPActions.selectPipeline(e.target.value);
    },

    _pipelineOptions(apps, selectedTags) {
        let filteredApps = [];
        if (selectedTags == null || selectedTags.length === 0) {
            filteredApps = apps;
        } else {
            selectedTags = selectedTags.split(',');
            for (let app of apps) {
                tagloop:
                    for (let tag of selectedTags) {
                        if (app.tags.indexOf(tag) > -1) {
                            filteredApps.push(app);
                            break tagloop;
                        }
                    }
            }
        }
        return filteredApps.map((app) => {
            return <option value={app.id} key={app.id}>{app.name}</option>;
        });
    }

});

export default Pipelines;