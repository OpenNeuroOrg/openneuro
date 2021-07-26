import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
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
      response = axios.post(url, null, null)
    } catch (e) {
      response = e
    }
    console.log(response)
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
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

    this.setState({ [e.target.name]: this.state.modalities })
  }

  handleSubmit = e => {
    let data = {
      ...this.state,
    }
    const id = '1GhgmqcdiPH1HPf8ZGqoQo33Lluds2IneAsn4U9Zv03M'
    e.preventDefault()
    const formUrl = 'https://docs.google.com/forms/d/' + id + '/formResponse'

    const q = queryString.stringifyUrl({
      url: formUrl,
      query: data,
    })
    this.myRequest(q)
    this.setState({ formCompleted: true })
  }

  render() {
    console.log(this.state.showFeedbackModal)

    return (
      <>
        {this.state.formCompleted ? null : (
          <button
            onClick={() =>
              this.setState({
                showFeedbackModal: !this.state.showFeedbackModal,
              })
            }>
            Give Redesign Feedback
          </button>
        )}
        <Modal
          isOpen={this.state.showFeedbackModal}
          toggle={() =>
            this.setState({ showFeedbackModal: !this.state.showFeedbackModal })
          }
          closeText={'close'}
          className="deprecated-modal">
          <p>welcome to the modal feedback form</p>

          {this.state.formCompleted ? (
            <>good work</>
          ) : (
            <form onSubmit={this.handleSubmit}>
              <div>
                <input
                  className="input"
                  type="text"
                  name="entry.355252395"
                  placeholder="Name"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <input
                  className="input"
                  type="email"
                  name="entry.1195118106"
                  placeholder="Email"
                  //required
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <h3>
                  <label htmlFor="entry.862044433">
                    How would you rate the new design?
                  </label>
                </h3>
                <select
                  className="input"
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
                  <h3>
                    <label htmlFor="entry.904614155">
                      When searching for a dataset where you able to find
                      relevant results?
                    </label>
                  </h3>
                  <input
                    className="input"
                    type="radio"
                    name="entry.904614155"
                    onChange={this.handleChange}
                    value="yes"
                  />
                  Yes
                  <input
                    className="input"
                    type="radio"
                    name="entry.904614155"
                    onChange={this.handleChange}
                    value="no"
                  />
                  No
                </div>
                <h3>
                  <label htmlFor="entry.1060778649">
                    If NO please provide more information?
                  </label>
                </h3>
                <textarea
                  className="input"
                  rows={12}
                  cols={10}
                  name="entry.1060778649"
                  placeholder="If No"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <h3>
                  <label htmlFor="entry.1855015875">
                    Which modality or modalities are you most interested in?
                    (check all that apply)
                  </label>
                </h3>
                <input
                  className="input"
                  type="checkbox"
                  name="entry.1855015875"
                  onChange={this.handleCheckboxChange}
                  value="MRI"
                />
                MRI
                <input
                  className="input"
                  type="checkbox"
                  name="entry.1855015875"
                  onChange={this.handleCheckboxChange}
                  value="PET"
                />
                PET
                <input
                  className="input"
                  type="checkbox"
                  name="entry.1855015875"
                  onChange={this.handleCheckboxChange}
                  value="EEG"
                />
                EEG
                <input
                  className="input"
                  type="checkbox"
                  name="entry.1855015875"
                  onChange={this.handleCheckboxChange}
                  value="iEEG"
                />
                iEEG
                <input
                  className="input"
                  type="checkbox"
                  name="entry.1855015875"
                  onChange={this.handleCheckboxChange}
                  value="MEG"
                />
                MEG
                <h3>
                  <label htmlFor="entry.1316853220">
                    For each modality selected please specify if you went to
                    search or directly to the modality portal?
                  </label>
                </h3>
                <textarea
                  className="input"
                  rows={12}
                  cols={10}
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
                  className="input"
                  rows={12}
                  cols={10}
                  name="entry.108518555"
                  placeholder="Other"
                  onChange={this.handleChange}
                />
              </div>
              <button className="button" type="submit">
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
