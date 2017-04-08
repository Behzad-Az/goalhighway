import React, {Component} from 'react';

class AnswerRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
  }

  _handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    fetch(`/api/flags/interview_answers/${this.props.ans.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    })
    .then(response => response.json())
    .then(resJSON => { if (!resJSON) throw 'Server returned false' })
    .catch(err => console.error('Unable to post flag - ', err))
    .then(() => this.setState(state));
  }

  _renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='inappropriate content'>inappropriate / unrelated</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </small>
    );
  }

  render() {
    return (
      <article className='media answer-row'>
        <div className='media-content'>
          <div className='content'>
            <p>
              <small className='date top-right'>Posted On: {this.props.ans.answer_created_at.slice(0, 10)}</small>
              <strong>
                Answer #{this.props.index} | Outcome: {this.props.ans.outcome}
              </strong>
              <br />
              {this.props.ans.answer}
              <br />
              <i className='fa fa-flag' aria-hidden='true' onClick={() => this.setState({ flagRequest: !this.state.flagRequest })} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              {this.state.flagRequest && this._renderFlagSelect()}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default AnswerRow;
