import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';

class NewAnswerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      outcome: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleNewInterviewAnswer = this.handleNewInterviewAnswer.bind(this);
  }

  handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  validateForm() {
    return this.state.answer &&
           this.state.outcome &&
           this.props.question.id
  }

  handleNewInterviewAnswer() {
    let data = {
      answer: this.state.answer,
      outcome: this.state.outcome
    };
    $.ajax({
      method: 'POST',
      url: `/api/companies/${this.props.companyId}/questions/${this.props.question.id}`,
      data: data,
      success: response => {
        response ? this.props.reload() : console.error("Error in server 0: ", response);
      }
    }).always(() => HandleModal(this.props.modalId));
  }

  render() {
    return (
      <div id={this.props.modalId} className="modal">
        <div className="modal-background" onClick={() => HandleModal(this.props.modalId)}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              { this.props.question.question.length > 35 ? `${this.props.question.question.slice(0, 35)}... ` : this.props.question.question } - New Answer
            </p>
            <button className="delete" onClick={() => HandleModal(this.props.modalId)}></button>
          </header>
          <section className="modal-card-body">

            <label className="label">What was your answer?</label>
            <p className="control">
              <textarea className="textarea" name="answer" placeholder="Summarize your answer here" onChange={this.handleChange} />
            </p>

            <label className="label">What was the outcome?</label>
            <p className="control">
              <span className="select">
                <select className="select" name="outcome" onChange={this.handleChange}>
                  <option value="">-</option>
                  <option value="Got the job">Got the job!</option>
                  <option value="Unsuccessful">Unsuccessful</option>
                  <option value="Unknown">Don't know</option>
                  <option value="Unknown">Rather not say</option>
                </select>
              </span>
            </p>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-primary" disabled={!this.validateForm()} onClick={this.handleNewInterviewAnswer}>Submit</button>
            <button className="button" onClick={() => HandleModal(this.props.modalId)}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewAnswerForm;
