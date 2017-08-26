import React, {Component} from 'react';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewAnswerForm extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      answer: { min: 5, max: 500 }
    };
    this.state = {
      answer: '',
      outcome: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewAnsSubmission = this._handleNewAnsSubmission.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.answer.length >= this.formLimits.answer.min &&
           !InvalidCharChecker(this.state.answer, this.formLimits.answer.max, 'interviewAnswer') &&
           this.state.outcome &&
           this.props.companyId &&
           this.props.qa.id;
  }

  _handleNewAnsSubmission() {
    const data = {
      answer: this.state.answer,
      outcome: this.state.outcome
    };

    fetch(`/api/companies/${this.props.companyId}/questions/${this.props.qa.id}/answers`, {
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
      if (resJSON) { this.props.reload(); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to post new interview answer - ', err))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              { this.props.qa.question.length > 35 ? `${this.props.qa.question.slice(0, 35)}... ` : this.props.qa.question } - New Answer
            </p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>
              What was your answer?
              { InvalidCharChecker(this.state.answer, this.formLimits.answer.max, 'interviewAnswer') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='answer'
                placeholder='Summarize your answer here'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.answer, this.formLimits.answer.max, 'interviewAnswer') ? '#9D0600' : '' }} />
            </p>

            <label className='label'>What was the outcome?</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='outcome' onChange={this._handleChange}>
                  <option value=''>-</option>
                  <option value='Got the job'>Got the job!</option>
                  <option value='Unsuccessful'>Unsuccessful</option>
                  <option value='Unknown'>Don't know yet</option>
                  <option value='Unknown'>Rather not say</option>
                </select>
              </span>
            </p>

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewAnsSubmission}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewAnswerForm;
