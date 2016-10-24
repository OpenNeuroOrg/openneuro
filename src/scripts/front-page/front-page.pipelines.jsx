// dependencies -------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import FPStore   from './front-page.store.js';
import FPActions from './front-page.actions.js';
import Select    from 'react-select';

// component setup ----------------------------------------------------

let Pipelines = React.createClass({

    mixins: [Reflux.connect(FPStore)],

// life cycle events --------------------------------------------------

    render() {
        return(
            <span>
                <div className="browse-pipelines">
                    <div className="container">
                        {this._browsePipelines()}
                    </div>
                </div>
                {!this.state.selectedPipeline.id ? null : this._pipelineDetail(this.state.selectedPipeline)}
            </span>
        );
    },

// template methods ---------------------------------------------------

    _browsePipelines() {
        let pipelineOptions = this._pipelineOptions(this.state.apps, this.state.selectedTags);
        return (
            <div className="row">
                <div className="col-sm-6 mate-slide">
                    <h3>Check Out a Few of Our Pipelines</h3>
                    <ul>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-bare-0.8.7')}>mriqc-bare</button>
                        </li>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-kiddo-0.8.6')}>mriqc-kiddo</button>
                        </li>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-bare-0.8.7')}>mriqc-bare</button>
                        </li>
                        <li>
                            <button onClick={FPActions.selectPipeline.bind(null, 'mriqc-kiddo-0.8.6')}>mriqc-kiddo</button>
                        </li>
                    </ul>
                </div>
                <div className="col-sm-6 mate-slide browse">
                    <h3>Or Browse Our Collection</h3>
                    <form>
                        <label>What kinds of pipelines are you interested in?</label>
                        <Select multi simpleValue value={this.state.selectedTags} placeholder="All Tags" options={this.state.tags} onChange={FPActions.selectTag} />
                        <br />
                        <label>browse {pipelineOptions.length} pipelines</label>
                        <span className="select-pipeline">
                            <select value={this.state.selectedPipeline.id} onChange={this._selectPipeline}>
                                <option value="" disabled>Select a Pipeline</option>
                                {pipelineOptions}
                            </select>
                            <span className="select-pipeline-arrow"></span>
                        </span>
                    </form>
                </div>
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
                        <div className="col-sm-6 mate-slide">

                        </div>
                    </div>
                </div>
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