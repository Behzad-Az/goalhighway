import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';

class NewQuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      answer: '',
      outcome: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleNewInterviewQuestion = this.handleNewInterviewQuestion.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  validateForm() {
    return this.state.question &&
           this.props.companyInfo.id
  }

  handleNewInterviewQuestion() {
    let data = {
      question: this.state.question,
      answer: this.state.answer,
      outcome: this.state.outcome
    };

    fetch(`/api/companies/${this.props.companyInfo.id}`, {
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
    .catch(err => console.error('Unable to post new interview question - ', err))
    .then(() => HandleModal('new-question-form'));
  }

  render() {
    return (
      <div id='new-question-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-question-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.companyInfo.name} - New Interview Question</p>
            <button className='delete' onClick={() => HandleModal('new-question-form')}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>What question were you asked?</label>
            <p className='control'>
              <input className='input' type='text' name='question' placeholder='Example: Describe a work conflict and how you dealt with it.' onChange={this.handleChange} />
            </p>

            <label className='label'>What was your answer? (optional)</label>
            <p className='control'>
              <textarea className='textarea' name='answer' placeholder='Summarize your answer here (optional)' onChange={this.handleChange} />
            </p>

            <label className='label'>What was the outcome? (optional)</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='outcome' onChange={this.handleChange}>
                  <option value=''>-</option>
                  <option value='Got the job'>Got the job!</option>
                  <option value='Unsuccessful'>Unsuccessful</option>
                  <option value='Unknown'>Don't know</option>
                  <option value='Unknown'>Rather not share</option>
                </select>
              </span>
            </p>

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this.validateForm()} onClick={this.handleNewInterviewQuestion}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-question-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewQuestionForm;
