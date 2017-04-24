import React, {Component} from 'react';

class NewQuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      answer: '',
      outcome: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleNewInterviewQuestion = this._handleNewInterviewQuestion.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.question &&
           this.props.companyInfo.id;
  }

  _handleNewInterviewQuestion() {
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
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.companyInfo.name} - New Interview Question</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>What question were you asked?</label>
            <p className='control'>
              <input
                className='input'
                type='text' name='question'
                placeholder='Example: Describe a work conflict and how you dealt with it.'
                onChange={this._handleChange}
              />
            </p>
            <label className='label'>What was your answer? (optional)</label>
            <p className='control'>
              <textarea
                className='textarea'
                name='answer'
                placeholder='Summarize your answer here (optional)'
                onChange={this._handleChange}
              />
            </p>
            <label className='label'>What was the outcome? (optional)</label>
            <p className='control'>
              <span className='select'>
                <select className='select' name='outcome' onChange={this._handleChange}>
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
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewInterviewQuestion}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewQuestionForm;
