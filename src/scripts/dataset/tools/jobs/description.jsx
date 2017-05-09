/*eslint react/no-danger: 0 */

import React    from 'react';
import markdown from '../../../utils/markdown';


const JobDescription = ({jobDefinition}) => {
    let descriptions = jobDefinition.descriptions;

    let shortDescription;
    if (descriptions && descriptions.shortDescription) {
        shortDescription = (
            <div>
                <h5>Short Description</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(descriptions.shortDescription)}></div>
            </div>
        );
    }

    let tags;
    if (descriptions && descriptions.tags) {
        tags = (
            <div>
                <h5>Tags</h5>
                <div className="well">{descriptions.tags}</div>
            </div>
        );
    }

    let description;
    if (descriptions && descriptions.description) {
        // descriptions.description = typeof descriptions.description === 'string' ? JSON.parse(descriptions.description) : descriptions.description;

        description = (
            <div>
                <h5>Description</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(descriptions.description)}></div>
            </div>
        );
    }

    let acknowledgments;
    if (descriptions && descriptions.acknowledgments) {
        acknowledgments = (
            <div>
                <h5>Acknowledgements</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(descriptions.acknowledgments)}></div>
            </div>
        );
    }

    let support;
    if (descriptions && descriptions.support) {
        support = (
            <div>
                <h5>Support</h5>
                <div className="well" dangerouslySetInnerHTML={markdown.format(descriptions.support)}></div>
            </div>
        );
    }

    return (
        <div>
            <br /><hr />
            {shortDescription}
            {description}
            {acknowledgments}
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