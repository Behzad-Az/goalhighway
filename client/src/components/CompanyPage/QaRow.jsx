import React, {Component} from 'react';
import { Link } from 'react-router';
import HandleModal from '../partials/HandleModal.js';
import AnswerRow from './AnswerRow.jsx';
import NewAnswerForm from './NewAnswerForm.jsx';

class QaRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: '',
      showAnswers: false
    };
    this.handleShowAnswers = this.handleShowAnswers.bind(this);
    this.handleFlagClick = this.handleFlagClick.bind(this);
    this.handleFlagSubmit = this.handleFlagSubmit.bind(this);
    this.renderFlagSelect = this.renderFlagSelect.bind(this);
  }

  handleShowAnswers() {
    let showAnswers = !this.state.showAnswers;
    this.setState({ showAnswers });
  }

  handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    $.ajax({
      method: 'POST',
      data: state,
      url: `/api/flags/interview_questions/${this.props.qa.id}`,
      success: response => {
        response ? console.log("i'm here 0: ", response) : console.error("Error in server 0: ", response);
      }
    }).always(() => this.setState(state));
  }

  renderFlagSelect() {
    return (
      <small className="control flag-submission">
        <span className="select is-small">
          <select name="flagReason" onChange={this.handleFlagSubmit}>
            <option value="">select reason</option>
            <option value="inappropriate content">inappropriate / unrelated</option>
            <option value="other">Other</option>
          </select>
        </span>
      </small>
    );
  }

  render() {
    const modalId = `new-answer-form-${this.props.qa.id}`;
    return (
      <article className="media qa-row">
        <NewAnswerForm question={this.props.qa} modalId={modalId} reload={this.props.reload} companyId={this.props.companyId} />
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{this.props.qa.question}</strong>
              <br />
              Posted On: {this.props.qa.question_created_at.slice(0, 10)}
              <br />
              Like Count: {this.props.qa.like_count}
              <br />
              <small><Link onClick={this.handleShowAnswers}>{ this.state.showAnswers ? "Hide Answers" : "Show Answers" }</Link></small>
              <i className="fa fa-flag" aria-hidden="true" onClick={this.handleFlagClick} style={{ color: this.state.flagRequest ? "#9D0600" : "inherit" }} />
              {this.state.flagRequest && this.renderFlagSelect()}
            </p>
            { this.state.showAnswers && <p><button className="button new-answer" onClick={() => HandleModal(modalId)}>Post New Answer</button></p> }
            { this.state.showAnswers && this.props.qa.answers.map((ans, index) => <AnswerRow key={index} ans={ans} index={index + 1}/>) }
            { this.state.showAnswers && !this.props.qa.answers[0] && <p>No answers provided yet...</p> }
          </div>
        </div>
      </article>
    );
  }
}

export default QaRow;
