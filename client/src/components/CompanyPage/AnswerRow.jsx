import React, {Component} from 'react';

class AnswerRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this.handleFlagClick = this.handleFlagClick.bind(this);
    this.handleFlagSubmit = this.handleFlagSubmit.bind(this);
    this.renderFlagSelect = this.renderFlagSelect.bind(this);
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
      url: `/api/flags/interview_answers/${this.props.ans.id}`,
      success: response => {
        response ? console.log('Flag submitted', response) : console.error('Error in server 0: ', response);
      }
    }).always(() => this.setState(state));
  }

  renderFlagSelect() {
    return (
      <small className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this.handleFlagSubmit}>
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
              <i className='fa fa-flag' aria-hidden='true' onClick={this.handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
              {this.state.flagRequest && this.renderFlagSelect()}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default AnswerRow;
