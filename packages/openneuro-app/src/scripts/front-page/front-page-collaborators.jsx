import React from 'react'

const Collaborators = () => (
  <span>
    <span className="openneuro-more">
      <div className="col-xs-12">
        <div className="logo-text">
          Open
          <span className="logo-end">Neuro</span>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <p>
            A free and open platform for sharing MRI, MEG, EEG, iEEG, and ECoG
            data
          </p>
        </div>
        <div className="col-sm-6">
          <p>
            View more information about
            <br />
            <a
              target="_blank"
              href="http://reproducibility.stanford.edu/"
              rel="noopener noreferrer">
              Stanford Center for Reproducible Neuroscience
            </a>
          </p>
        </div>
      </div>
    </span>
    <span className="bids-more">
      <div className="col-xs-12">
        <h3>Brain Imaging Data Structure (BIDS) </h3>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <p>
            A Validator for the Brain Imaging Data Structure
            <br />
            Read more about the{' '}
            <a
              target="_blank"
              href="http://bids.neuroimaging.io/"
              rel="noopener noreferrer">
              BIDS specifications
            </a>
          </p>
        </div>
        <div className="col-sm-6">
          <p>
            Want to contribute to BIDS?
            <br />
            Visit the{' '}
            <a
              target="_blank"
              href="https://groups.google.com/forum/#!forum/bids-discussion"
              rel="noopener noreferrer">
              Google discussion group
            </a>{' '}
            to contribute.
          </p>
        </div>
      </div>
    </span>
    <span className="bids-more">
      <div className="col-xs-12">
        <h3>DataLad</h3>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <p>
            A data management solution built on{' '}
            <a
              target="_blank"
              href="https://git-scm.com"
              rel="noopener noreferrer">
              Git
            </a>{' '}
            and{' '}
            <a
              target="_blank"
              href="https://git-annex.branchable.com"
              rel="noopener noreferrer">
              Git-annex
            </a>
            <br />
            Read more about{' '}
            <a
              target="_blank"
              href="http://datalad.org"
              rel="noopener noreferrer">
              DataLad
            </a>
          </p>
        </div>
        <div className="col-sm-6">
          <p>
            Want to access OpenNeuro datasets with DataLad?
            <br />
            Visit the{' '}
            <a
              target="_blank"
              href="https://github.com/OpenNeuroDatasets"
              rel="noopener noreferrer">
              dataset collection on GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </span>
  </span>
)

export default Collaborators
