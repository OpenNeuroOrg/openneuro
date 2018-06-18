// dependencies -------------------------------------------------------

import React from 'react'

class Faq extends React.Component {
  render() {
    let faqsList = [
      {
        faq: <span>How do I get started?</span>,
        faq_answer: (
          <span>
            Check out our{' '}
            <a href="https://www.youtube.com/playlist?list=PLU-IMZq18nDsf6VpCrLezLgylfAbRPPV8">
              video tutorial
            </a>.
          </span>
        ),
      },
      {
        faq: <span>Is this service free to use?</span>,
        faq_answer: <span>Yes!</span>,
      },
      {
        faq: (
          <span>
            Can I restrict access to my data and analysis results on OpenNeuro?
          </span>
        ),
        faq_answer: (
          <span>
            Yes, but only for a period of 36 months counted from first
            successful analysis of data from more than one participant. After
            this period the dataset and related analysis results will be made
            publicly available.
          </span>
        ),
      },
      {
        faq: <span>Are there any restrictions on the uploaded data?</span>,
        faq_answer: (
          <span>
            Yes. By uploading this dataset to OpenNeuro you have to agree to the
            following conditions:
            <ul>
              <li>
                you are the owner of this dataset and have any necessary ethics
                permissions to share the data publicly.
              </li>
              <li>
                This dataset does not include any identifiable personal health
                information as defined by the Health Insurance Portability and
                Accountability Act of 1996 (including names, zip codes, dates of
                birth, acquisition dates, facial features on structural scans
                etc.).
              </li>
              <li>
                You agree that this dataset and results of all analyses
                performed on it using the OpenNeuro platform will become
                publicly available under a Creative Commons CC0 or CC-BY license
                after a grace period of 36 months counted from first successful
                analysis of data from more than one participant.
              </li>
            </ul>
          </span>
        ),
      },
      {
        faq: (
          <span>
            What if I will not be able to publish my paper in 36 months?
          </span>
        ),
        faq_answer: (
          <span>
            You can apply for up to two 6 month long extensions of the grace
            period. To apply please contact support. We encourage you to publish
            a preprint of your work to reduce the uncertainty of the publishing
            pipeline.
          </span>
        ),
      },
      {
        faq: (
          <span>
            Can I upload and analyze a publicly available dataset from another
            repository?
          </span>
        ),
        faq_answer: (
          <span>
            The mission of OpenNeuro is to incentivize data sharing via
            providing data analysis service. Thus we discourage using it to
            analyze already publicly available datasets. This policy might
            change in the future depending on improvements in analysis cost.
          </span>
        ),
      },
      {
        faq: (
          <span>
            Do I need to format my data in some special way before uploading it
            to OpenNeuro?
          </span>
        ),
        faq_answer: (
          <span>
            Yes! OpenNeuro only accepts data in the Brain Imaging Data Structure
            (BIDS) format. You can read about it more at{' '}
            <a
              href="http://bids.neuroimaging.io/"
              target="_blank"
              rel="noopener noreferrer">
              bids.neuroimaging.io
            </a>. If you have any questions about organizing your data please
            post them at
            <a
              href="https://neurostars.org/tags/bids"
              target="_blank"
              rel="noopener noreferrer">
              neurostars.org
            </a>.
          </span>
        ),
      },
      {
        faq: (
          <span>
            Do I need to remove facial features from structural images before
            uploading the data?
          </span>
        ),
        faq_answer: (
          <span>
            Yes. We recommend using{' '}
            <a
              href="https://pypi.python.org/pypi/pydeface"
              target="_blank"
              rel="noopener noreferrer">
              pydeface
            </a>. Defacing is strongly preffered over skullstripping, because
            the process is more robust and yields lower chance of accidentally
            removing brain tissue.
          </span>
        ),
      },
      {
        faq: (
          <span>
            I am having trouble downloading with Firefox, what can I do?
          </span>
        ),
        faq_answer: (
          <span>
            <p>
              Firefox is working to support the APIs used by downloads but as of
              Firefox 60, these features are hidden behind experimental
              configuration flags. Chrome is recommended for dataset or snapshot
              downloads, but you can try out Firefox support by enabling three{' '}
              <q>about:config</q> flags.
            </p>
            <ul>
              <li>dom.streams.enabled - enables web streams.</li>
              <li>
                javascript.options.streams - allows Javascript to use the API.
              </li>
              <li>
                dom.ipc.multiOptOut - works around thread bugs, this may not be
                needed but improves reliablity on some platforms.
              </li>
            </ul>
            <p>
              You can find out more about{' '}
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API">
                web streams on MDN.
              </a>
            </p>
          </span>
        ),
      },
    ]

    let faqs = faqsList.map((item, index) => {
      return (
        <div className="panel" key={index}>
          <div className="panel-heading">{item.faq}</div>
          <div className="panel-body">{item.faq_answer}</div>
        </div>
      )
    })

    return (
      <div className="container faqs">
        <h1>{"FAQ's"}</h1>
        {faqs}
      </div>
    )
  }
}

export default Faq
