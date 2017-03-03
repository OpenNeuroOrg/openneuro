/*eslint react/no-danger: 0 */

import React    from 'react';
import markdown from '../../../utils/markdown';


const JobDescription = ({jobDefinition}) => {

    let shortDescription;
    if (jobDefinition.shortDescription) {
        shortDescription = (
            <div>
                <h5>Short Description</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(jobDefinition.shortDescription)}></div>
            </div>
        );
    }

    let help;
    if (jobDefinition.helpURI) {
        help = (
            <div>
                <h5>Help</h5>
                <div className="well">
                    <a href={jobDefinition.helpURI} target="_blank">{jobDefinition.helpURI}</a>
                </div>
            </div>
        );
    }

    let tags;
    if (jobDefinition.tags) {
        tags = (
            <div>
                <h5>Tags</h5>
                <div className="well">{jobDefinition.tags.join(', ')}</div>
            </div>
        );
    }

    let description,
        acknowledgments,
        support;
    if (jobDefinition.longDescription) {
        jobDefinition.longDescription = typeof jobDefinition.longDescription === 'string' ? JSON.parse(jobDefinition.longDescription) : jobDefinition.longDescription;

        description = (
            <div>
                <h5>Description</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(jobDefinition.longDescription.description)}></div>
            </div>
        );

        acknowledgments = (
            <div>
                <h5>Acknowledgements</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(jobDefinition.longDescription.acknowledgments)}></div>
            </div>
        );

        support = (
            <div>
                <h5>Support</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(jobDefinition.longDescription.support)}></div>
            </div>
        );
    }

    return (
        <div>
            <br /><hr />
            {shortDescription}
            {description}
            {acknowledgments}
            {help}
            {support}
            {tags}
        </div>
    );
};

JobDescription.propTypes = {
    jobDefinition: React.PropTypes.object
};

JobDescription.defaultProps = {
    jobDefinition: {}
};

export default JobDescription;