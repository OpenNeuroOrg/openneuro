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
        let pipelineOptions = this._pipelineOptions(this.state.apps, this.state.selectedTags);
        return(
            <div className="browse-pipelines">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 mate-slide">
                            <h3>Check Out Our Pipelines</h3>
                            <p>Lorem analysis pipelines snapshots datasets. Lorem ipsum dolor sit amet, consectetur ad adipiscing elit.</p>
                            <ul>
                                <li>Freesurfer</li>
                                <li>The Human Connectome Project</li>
                                <li>Other</li>
                                <li>mriqc</li>
                            </ul>
                        </div>
                        <div className="col-sm-6 mate-slide">
                            <h3>Or Browse Pipelines</h3>
                            <form>
                                <label>What kinds of pipelines are you interested in?</label>
                                <Select multi simpleValue value={this.state.selectedTags} placeholder="All Tags" options={this.state.tags} onChange={FPActions.selectTag} />
                                <br />
                                <label>browse {pipelineOptions.length} pipelines</label>
                                <select value={this.state.selectedPipeline}>
                                    <option value="" disabled>Select a Pipeline</option>
                                    {pipelineOptions}
                                </select>
                            </form>
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