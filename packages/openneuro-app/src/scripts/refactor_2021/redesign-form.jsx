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
    let response
    try {
      response = fetch(url, { method: 'POST' })
    } catch (e) {
      response = e
    }
    console.log(response)
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
    console.log(this.state.entryFields)
    this.setState({ formCompleted: true })
  }

  render() {
    return (
      <>
        {this.state.formCompleted ? null : (
          <button
            className="on-button--small on-button on-button--primary open-feedback-modal-button"
            onClick={() =>
              this.setState({
                showFeedbackModal: !this.state.showFeedbackModal,
              })
            }>
            Submit Redesign Feedback
          </button>
        )}
        <Modal
          isOpen={this.state.showFeedbackModal}
          toggle={() =>
            this.setState({ showFeedbackModal: !this.state.showFeedbackModal })
          }
          closeText={'close'}
          className="feedback-form feedback-modal">
          <h2>
            {this.state.formCompleted
              ? 'Thank you for your feedback'
              : 'welcome to the modal feedback form'}
          </h2>

          {this.state.formCompleted ? (
            'We appreciate the your time and feedback, it will help to create a better experience for you and others.'
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
                  How would you rate the new design?
                </label>
              </h3>
              <div className="on-select-wrapper">
                <select
                  className="feedback-input"
                  name="entry.862044433"
                  onChange={this.handleChange}
                  defaultValue="">
                  <option value="" disabled hidden>
                    Select an Option
                  </option>
                  <option value="5">Great</option>
                  <option value="4">Good</option>
                  <option value="3">Ok</option>
                  <option value="2">SoSo</option>
                  <option value="1">Bad</option>
                </select>
              </div>
              <div>
                <div>
                  <span className="custom-radio">
                    <h3>
                      When searching for a dataset where you able to find
                      relevant results?
                    </h3>
                    <input
                      className="feedback-input"
                      type="radio"
                      name="entry.787827886"
                      onChange={this.handleChange}
                      value="yes"
                      id="entry.787827886.yes"
                    />
                    <label htmlFor="entry.787827886.yes">Yes</label>
                    <input
                      className="feedback-input"
                      type="radio"
                      name="entry.787827886"
                      onChange={this.handleChange}
                      value="no"
                      id="entry.787827886.no"
                    />
                    <label htmlFor="entry.787827886.no">No</label>
                  </span>
                </div>
                <h3>
                  <label htmlFor="entry.1060778649">
                    If NO please provide more information?
                  </label>
                </h3>
                <textarea
                  className="feedback-input"
                  rows={8}
                  cols={100}
                  name="entry.1060778649"
                  placeholder="If No"
                  onChange={this.handleChange}
                />
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
                    For each modality selected please specify if you went to
                    search or directly to the modality portal?
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
                type="submit">
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
