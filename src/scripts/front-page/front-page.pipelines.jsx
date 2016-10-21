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
            <div className="browse-pipelines">
                <div className="container">
                    {!this.state.selectedPipeline.id ? this._browsePipelines() : this._pipelineDetail(this.state.selectedPipeline)}
                </div>
            </div>
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
                        <li>Freesurfer</li>
                        <li>The Human Connectome Project</li>
                        <li>Other</li>
                        <li>mriqc</li>
                    </ul>
                </div>
                <div className="col-sm-6 mate-slide">
                    <h3>Or Browse Our Collection</h3>
                    <form>
                        <label>What kinds of pipelines are you interested in?</label>
                        <Select multi simpleValue value={this.state.selectedTags} placeholder="All Tags" options={this.state.tags} onChange={FPActions.selectTag} />
                        <br />
                        <label>browse {pipelineOptions.length} pipelines</label>
                        <select value={this.state.selectedPipeline.id} onChange={this._selectPipeline}>
                            <option value="" disabled>Select a Pipeline</option>
                            {pipelineOptions}
                        </select>
                    </form>
                </div>
            </div>
        );
    },

    _pipelineDetail(pipeline) {
        pipeline.longDescription = JSON.parse(pipeline.longDescription);
        return (
            <div className="row">
                <div className="col-sm-6 mate-slide">
                    <a href="#" onClick={FPActions.selectPipeline.bind(null, '')}>back to browse</a>
                    <h2>{pipeline.name}</h2>
                    <p>{pipeline.longDescription.description}</p>
                    <h4>Acknowledgments</h4>
                    <p>{pipeline.longDescription.acknowledgments}</p>
                    <h4>Support</h4>
                    <p><a href={pipeline.longDescription.support}>{pipeline.longDescription.support}</a></p>
                    <h4>Help</h4>
                    <p><a href={pipeline.helpURI}>{pipeline.helpURI}</a></p>
                </div>
                <div className="col-sm-6 mate-slide">

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
        if (selectedTags.length === 0) {
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