// dependencies -------------------------------------------------------

import React                        from 'react';

class Faq extends React.Component {

    render () {
        let faqsList = [
            {
                faq: <span>Is this service free to use?</span>,
                faq_answer: <span>Yes!</span>
            },
            {
                faq: <span>Can I restrict access to my data and analysis results on OpenNeuro?</span>,
                faq_answer: <span>Yes, but only for a period of 18 months counted from first successful analysis of data from more than one participant. After this period the dataset and related analysis results will be made publicly available.</span>
            },
            {
                faq: <span>Are there any restrictions on the uploaded data?</span>,
                faq_answer: <span>Yes. By uploading this dataset to OpenNeuro you have to agree to the following conditions:
                    <ul>
                    <li>you are the owner of this dataset and have any necessary ethics permissions to share the data publicly.</li>
                    <li>This dataset does not include any identifiable personal health information as defined by the Health Insurance Portability and Accountability Act of 1996 (including names, zip codes, dates of birth, acquisition dates, facial features on structural scans etc.).</li>
                    <li>You agree that this dataset and results of all analyses performed on it using the OpenNeuro platform will become publicly available under a Creative Commons CC0 (“no rights reserved”) license after a grace period of 18 months counted from first successful analysis of data from more than one participant.</li>
                    </ul>
                    </span>,
            },
            {
                faq: <span>Do I need to format my data in some special way before uploading it to OpenNeuro?</span>,
                faq_answer: <span>Yes! OpenNeuro only accepts data in the Brain Imaging Data Structure (BIDS) format. You can read about it more at <a href="http://bids.neuroimaging.io/" target="_blank">bids.neuroimaging.io</a></span>
            },
            {
                faq: <span>Do I need to remove facial features from structural images before uploading the data?</span>,
                faq_answer: <span>Yes. We recommend using <a href="https://pypi.python.org/pypi/pydeface" target="_blank">pydeface</a>.</span>
            },
        ];

        let faqs = faqsList.map((item, index) => {
            return (

                <div className="panel" key={index}>
                    <div className="panel-heading">{item.faq}</div>
                    <div className="panel-body">
                    {item.faq_answer}
                    </div>
                </div>
            );

        });

        return (
            <div className="container faqs">
                <h1>{"FAQ's"}</h1>
                {faqs}
            </div>
        );
    }

}

export default Faq;