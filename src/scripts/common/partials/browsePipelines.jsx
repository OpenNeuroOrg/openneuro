// dependencies -------------------------------------------------------

import React       from 'react';

let BrowsePipelines = React.createClass({

// life cycle events --------------------------------------------------

    render () {
        return (
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
		                		<select>
		                			<option>asdf</option>
		                		</select>
		                		<br />
		                		<label>browse X pipelines</label>
		                		<select>
		                			<option>asdf</option>
		                		</select>
	                		</form>
	                	</div>
                	</div>
                </div>
            </div>
        );
    }

});

export default BrowsePipelines;