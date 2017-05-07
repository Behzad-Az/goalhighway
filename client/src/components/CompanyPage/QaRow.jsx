import React, {Component} from 'react';
import { Link } from 'react-router';
import AnswerRow from './AnswerRow.jsx';
import NewAnswerForm from './NewAnswerForm.jsx';

class QaRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewAnswerForm: false,
      flagRequest: false,
      flagReason: '',
      showAnswers: false
    };
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
    this._toggleNewAnswerForm = this._toggleNewAnswerForm.bind(this);
  }

  _handleFlagSubmit(e) {
    if (e.target.value) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      fetch(`/api/flags/interview_questions/${this.props.qa.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newState)
      })
      .then(response => response.json())
      .then(resJSON => { if (!resJSON) throw 'Server returned false' })
      .catch(err => console.error('Unable to post flag - ', err))
      .then(() => this.setState(newState));
    }
  }

  _renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='inappropriate content'>Inappropriate content</option>
            <option value='spam'>Spam</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </small>
    );
  }

  _toggleNewAnswerForm() {
    this.setState({ showNewAnswerForm: !this.state.showNewAnswerForm });
  }

  render() {
    return (
      <article className='media qa-row'>
        <NewAnswerForm
          question={this.props.qa}
          reload={this.props.reload}
          companyId={this.props.companyId}
          showModal={this.state.showNewAnswerForm}
          toggleModal={this._toggleNewAnswerForm}
        />
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>{this.props.qa.question}</strong>
              <br />
              Posted On: {this.props.qa.created_at.slice(0, 10)}
              <br />
              Like Count: {this.props.qa.like_count}
              <br />
              <small><Link onClick={() => this.setState({ showAnswers: !this.state.showAnswers })}>{ this.state.showAnswers ? 'Hide Answers' : 'Show Answers' }</Link></small>
              <i className='fa fa-flag' aria-hidden='true' onClick={() => this.setState({ flagRequest: !this.state.flagRequest })} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              { this.state.flagRequest && this._renderFlagSelect() }
            </p>
            { this.state.showAnswers && <p><button className='button new-answer' onClick={this._toggleNewAnswerForm}>Post New Answer</button></p> }
            { this.state.showAnswers && this.props.qa.answers.map((ans, index) => <AnswerRow key={ans.id} ans={ans} index={index + 1}/>) }
            { this.state.showAnswers && !this.props.qa.answers[0] && <p>No answers provided yet...</p> }
          </div>
        </div>
      </article>
    );
  }
}

export default QaRow;
