// dependencies -------------------------------------------------------

import React                        from 'react';

class Faq extends React.Component {

    render () {
        return (
            <div>
                <dl>
                    <dt>
                        Is this service free to use?
                    </dt>
                    <dd>
                        Yes!
                    </dd>
                    <dt>
                        Can I restrict access to my data and analysis results on OpenNeuro?
                    </dt>
                    <dd>
                        Yes, but only for a period of 18 months counted from first successful analysis of data from more than one participant. After this period the dataset and related analysis results will be made publicly available.
                    </dd>
                    <dt>
                        Are there any restrictions on the uploaded data?
                    </dt>
                    <dd>
                        Yes. By uploading this dataset to OpenNeuro you have to agree to the following conditions:
                        <ul>
                            <li>
                                you are the owner of this dataset and have any necessary ethics permissions to share the data publicly.
                            </li>
                            <li>
                                This dataset does not include any identifiable personal health information as defined by the Health Insurance Portability and Accountability Act of 1996 (including names, zip codes, dates of birth, acquisition dates, facial features on structural scans etc.).
                            </li>
                            <li>
                                You agree that this dataset and results of all analyses performed on it using the OpenNeuro platform will become publicly available under a Creative Commons CC0 (“no rights reserved”) license after a grace period of 18 months counted from first successful analysis of data from more than one participant.
                            </li>
                        </ul>
                    </dd>
                    <dt>
                        Do I need to format my data in some special way before uploading it to OpenNeuro?
                    </dt>
                    <dd>
                        Yes! OpenNeuro only accepts data in the Brain Imaging Data Structure (BIDS) format. You can read about it more at <a href="http://bids.neuroimaging.io/" target="_blank">http://bids.neuroimaging.io/</a>
                    </dd>
                    <dt>
                        Do I need to remove facial features from structural images before uploading the data?
                    </dt>
                    <dd>
                        Yes. We recommend using <a href="https://pypi.python.org/pypi/pydeface" target="_blank">pydeface</a>.
                    </dd>
                </dl>
            </div>
        );
    }

}

export default Faq;