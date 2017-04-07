import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewResumeReviewForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      title: this.props.resume.title,
      additionalInfo: this.props.resume.intent
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleNewResumeReviewReq = this._handleNewResumeReviewReq.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _handleNewResumeReviewReq() {
    let data = {
      title: this.state.title,
      additionalInfo: this.state.additionalInfo
    };

    fetch(`/api/feed/resumes/${this.props.resume.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.reactAlert.showAlert('Resume submitted for peer review', 'info');
        this.props.updateState();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(() => this.reactAlert.showAlert('Unable to submit resume review', 'error'))
    .then(() => HandleModal(`new-resume-review-req-form-${this.props.resume.id}`));
  }

  render() {
    let formId = `new-resume-review-req-form-${this.props.resume.id}`;
    return (
      <div id={formId} className='modal'>
        <div className='modal-background' onClick={() => HandleModal(formId)}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>New Resume Review Request</p>
            <button className='delete' onClick={() => HandleModal(formId)}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>Resume Title:</label>
            <p className='control'>
              <input className='input' type='text' name='title' placeholder='Enter resume title here' defaultValue={this.state.title} onChange={this._handleChange} />
            </p>
            <label className='label'>Provide Addtional Info (Recommended):</label>
            <p className='control'>
              <textarea className='textarea' name='additionalInfo' placeholder='Example: I intend to use this resume for junior level mechanical engineering jobs in aerospace industry.' defaultValue={this.state.additionalInfo} onChange={this._handleChange} />
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this.state.title} onClick={this._handleNewResumeReviewReq}>Submit</button>
            <button className='button' onClick={() => HandleModal(formId)}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewResumeReviewForm;