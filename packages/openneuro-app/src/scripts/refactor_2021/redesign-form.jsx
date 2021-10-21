import React from 'react'
import { Modal } from '@openneuro/components/modal'

class ContactForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalities: [],
      formCompleted: false,
      showFeedbackModal: false,
    }
  }
  myRequest = url => {
    fetch(url, { method: 'POST' })
  }
  handleChange = e => {
    const entryFields = { ...this.state.entryFields }
    entryFields[e.target.name] = e.target.value
    this.setState({ entryFields })
  }

  handleCheckboxChange = e => {
    if (this.state.modalities.includes(e.target.value)) {
      this.state.modalities.splice(
        this.state.modalities.indexOf(e.target.value),
        1,
      )
    } else {
      this.state.modalities.push(e.target.value)
    }

    const entryFields = { ...this.state.entryFields }
    entryFields[e.target.name] = this.state.modalities.join()
    this.setState({ entryFields })
  }

  handleSubmit = e => {
    e.preventDefault()
    const id = '1GhgmqcdiPH1HPf8ZGqoQo33Lluds2IneAsn4U9Zv03M'
    const formUrl = 'https://docs.google.com/forms/d/' + id + '/formResponse?'

    let q = new URLSearchParams(this.state.entryFields).toString()

    this.myRequest(formUrl + q)
    this.setState({ formCompleted: true })
  }

  render() {
    return (
      <>
        {this.state.formCompleted ? null : (
          <button
            className="on-button--large on-button on-button--secondary open-feedback-modal-button"
            onClick={() =>
              this.setState({
                showFeedbackModal: !this.state.showFeedbackModal,
              })
            }
          >
            Click HERE to Submit Redesign Feedback
            <br />
            or Visit the Original Site Design
          </button>
        )}
        <Modal
          isOpen={this.state.showFeedbackModal}
          toggle={() =>
            this.setState({ showFeedbackModal: !this.state.showFeedbackModal })
          }
          closeText={'close'}
          className="feedback-form feedback-modal"
        >
          <h2>
            {this.state.formCompleted
              ? 'Thank you for your feedback'
              : 'Please provide feedback about the new OpenNeuro Search and redesign'}
          </h2>

          {this.state.formCompleted ? (
            <span>
              <p>
                We appreciate your time and feedback, it will help to create a
                better experience for you and others.
              </p>
              <p>
                Feel free to continue exploring and using the new design or
                <br />
                <br />
                <a href="/crn/feature/redesign-2021/disable">
                  GO TO THE ORIGINAL SITE DESIGN
                </a>
                <br />
                <p>
                  <small>
                    Please note that the redesign site will become the official
                    landing site for OpenNeuro beginning November 17th, 2021.
                    Therefore, users will be unable to visit the original site
                    design after November 16th.
                  </small>
                </p>
              </p>
            </span>
          ) : (
            <form onSubmit={this.handleSubmit}>
              <div>
                <input
                  className="feedback-input"
                  type="text"
                  name="entry.355252395"
                  placeholder="Name"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <input
                  className="feedback-input"
                  type="email"
                  name="entry.1195118106"
                  placeholder="Email"
                  //required
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <input
                  className="feedback-input"
                  type="text"
                  name="entry.1640248266"
                  placeholder="Role/Title/Position"
                  onChange={this.handleChange}
                />
              </div>
              <h3>
                <label htmlFor="entry.862044433">
                  Which of the following best describes your experience with the
                  new design?<span className="required">*</span>
                </label>
              </h3>
              <div className="on-select-wrapper">
                <select
                  className="feedback-input"
                  name="entry.862044433"
                  onChange={this.handleChange}
                  defaultValue=""
                  required
                >
                  <option value="" disabled hidden>
                    Select an Option
                  </option>
                  <option value="Exciting and easy to navigate">
                    Exciting and easy to navigate
                  </option>
                  <option value="Good overall experience">
                    Good overall experience
                  </option>
                  <option value="Visually pleasing, not quite as intuitive">
                    Visually pleasing, not quite as intuitive
                  </option>
                  <option value="Couldn’t achieve my goal">
                    Couldn’t achieve my goal
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <div>
                  <h3>
                    <label htmlFor="entry.1308425561">
                      Please provide more information for your choice above.
                    </label>
                  </h3>
                  <textarea
                    className="feedback-input"
                    rows={8}
                    cols={100}
                    name="entry.1308425561"
                    placeholder="Design Feedback"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <h3>
                    <label htmlFor="entry.462214641">
                      How would you rate the new search and portals?
                      <span className="required">*</span>
                    </label>
                  </h3>
                  <div className="on-select-wrapper">
                    <select
                      className="feedback-input"
                      name="entry.462214641"
                      onChange={this.handleChange}
                      defaultValue=""
                      required
                    >
                      <option value="" disabled hidden>
                        Select an Option
                      </option>
                      <option value="Exciting and easy to navigate">
                        Exciting and easy to navigate
                      </option>
                      <option value="Good overall experience">
                        Good overall experience
                      </option>
                      <option value="Visually pleasing, not quite as intuitive">
                        Visually pleasing, not quite as intuitive
                      </option>
                      <option value="Couldn’t achieve my goal">
                        Couldn’t achieve my goal
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <h3>
                  <label htmlFor="entry.1060778649">
                    Please provide more information for your choice above.
                  </label>
                </h3>
                <textarea
                  className="feedback-input"
                  rows={8}
                  cols={100}
                  name="entry.1060778649"
                  placeholder="Search Feedback"
                  onChange={this.handleChange}
                />
                <h3>
                  <label htmlFor="entry.904614155">
                    When searching for a dataset were you able to find relevant
                    results?
                  </label>
                </h3>
                <div className="on-select-wrapper">
                  <select
                    className="feedback-input"
                    name="entry.904614155"
                    onChange={this.handleChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select an Option
                    </option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
                <div>
                  <h3>
                    <label htmlFor="entry.883106466">
                      Please provide more information for your choice above.
                    </label>
                  </h3>
                  <textarea
                    className="feedback-input"
                    rows={8}
                    cols={100}
                    name="entry.883106466"
                    placeholder="Search Results"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div>
                <span className="custom-checkbox">
                  <h3>
                    Which modality or modalities are you most interested in?
                    (check all that apply)
                  </h3>
                  <input
                    className="feedback-input"
                    type="checkbox"
                    name="entry.787827886"
                    onChange={this.handleCheckboxChange}
                    value="MRI"
                    id="entry.787827886.mri"
                  />
                  <label htmlFor="entry.787827886.mri">MRI</label>
                  <input
                    className="feedback-input"
                    type="checkbox"
                    name="entry.787827886"
                    onChange={this.handleCheckboxChange}
                    value="PET"
                    id="entry.787827886.pet"
                  />
                  <label htmlFor="entry.787827886.pet">PET</label>
                  <input
                    className="feedback-input"
                    type="checkbox"
                    name="entry.787827886"
                    onChange={this.handleCheckboxChange}
                    value="EEG"
                    id="entry.787827886.eeg"
                  />
                  <label htmlFor="entry.787827886.eeg">EEG</label>
                  <input
                    className="feedback-input"
                    type="checkbox"
                    name="entry.787827886"
                    onChange={this.handleCheckboxChange}
                    value="iEEG"
                    id="entry.787827886.ieeg"
                  />
                  <label htmlFor="entry.787827886.ieeg">iEEG</label>
                  <input
                    className="feedback-input"
                    type="checkbox"
                    name="entry.787827886"
                    onChange={this.handleCheckboxChange}
                    value="MEG"
                    id="entry.787827886.meg"
                  />
                  <label htmlFor="entry.787827886.meg">MEG</label>
                </span>
                <h3>
                  <label htmlFor="entry.1316853220">
                    For each modality selected please specify if you first went
                    to the global Search or directly to the modality portal?
                  </label>
                </h3>
                <textarea
                  className="feedback-input"
                  rows={8}
                  cols={100}
                  name="entry.1316853220"
                  placeholder="For Each"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <h3>
                  <label htmlFor="entry.813726139">
                    When logged into the site, were you able to easily find your
                    datasets?
                  </label>
                </h3>
                <div className="on-select-wrapper">
                  <select
                    className="feedback-input"
                    name="entry.813726139"
                    onChange={this.handleChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select an Option
                    </option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <h3>
                  <label htmlFor="entry.1753056808">
                    Which best describes your experience with the new design of
                    the dataset page:
                  </label>
                </h3>
                <div className="on-select-wrapper">
                  <select
                    className="feedback-input"
                    name="entry.1753056808"
                    onChange={this.handleChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select an Option
                    </option>
                    <option value="Intuitive and easy to navigate">
                      Intuitive and easy to navigate
                    </option>
                    <option value="Intuitively formatted but couldn't achieve my goal">
                      Intuitively formatted but couldn't achieve my goal
                    </option>
                    <option value="Difficult to navigate and couldn't achieve my goal">
                      Difficult to navigate and couldn't achieve my goal
                    </option>

                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <h3>
                    <label htmlFor="entry.211675296">
                      Please provide more information for your choice above.
                    </label>
                  </h3>
                  <textarea
                    className="feedback-input"
                    rows={8}
                    cols={100}
                    name="entry.211675296"
                    placeholder="Dataset Design Feedback"
                    onChange={this.handleChange}
                  />
                </div>

                <h3>
                  <label htmlFor="entry.108518555">
                    Any other feedback you would like to give?
                  </label>
                </h3>
                <textarea
                  className="feedback-input"
                  rows={8}
                  cols={100}
                  name="entry.108518555"
                  placeholder="Other"
                  onChange={this.handleChange}
                />
              </div>
              <button
                className="on-button--small on-button on-button--primary"
                type="submit"
              >
                Submit
              </button>
            </form>
          )}
        </Modal>
      </>
    )
  }
}
export default ContactForm
