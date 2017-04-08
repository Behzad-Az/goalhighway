import React, {Component} from 'react';
import { browserHistory } from 'react-router';

const download = require('../../download.js');

class RevisionRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagRequest: false,
      flagReason: ''
    };
    this._handleRevisionRequest = this._handleRevisionRequest.bind(this);
    this._handleDeletionRequest = this._handleDeletionRequest.bind(this);
    this._handleFlagClick = this._handleFlagClick.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
  }

  _handleRevisionRequest() {
    fetch(`/api/courses/${this.props.docInfo.course_id}/docs/${this.props.docInfo.id}/revisions/${this.props.rev.id}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.status === 200) { return response.blob(); }
      else { throw 'Server returned false.'; }
    })
    .then(blob => download(blob))
    .catch(err => console.error('Unable to download file: - ', err));
  }

  _handleDeletionRequest() {
    fetch(`/api/courses/${this.props.docInfo.course_id}/docs/${this.props.docInfo.id}/revisions/${this.props.rev.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { resJSON.url === this.props.currentUrl ? this.props.reload(this.props.docInfo.course_id, this.props.docInfo.id) : browserHistory.push(resJSON.url); }
      else { throw 'Server returned false'; }
    })
    .catch(err => console.error('Unable to delete revision - ', err));
  }

  _handleFlagClick() {
    let flagRequest = !this.state.flagRequest;
    this.setState({ flagRequest });
  }

  _handleFlagSubmit(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    fetch(`/api/flags/revisions/${this.props.rev.id}`, {
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
      <p className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='inappropriate content'>Inappropriate content</option>
            <option value='does not belong to this course'>Doesn't belong to this course</option>
            <option value='corrupted file or unreadable'>Corrupted file / unreadable</option>
            <option value='other'>Other</option>
          </select>
        </span>
      </p>
    );
  }

  render() {
    return (
      <div className='revision-row columns'>
        <div className='column is-3'>Date:<br/>{this.props.rev.created_at.slice(0, 10)}</div>
        <div className='column is-6'>Description:<br/>{this.props.rev.rev_desc}</div>
        <div className='column is-3 buttons'>
          <i className='fa fa-download' aria-hidden='true' onClick={this._handleRevisionRequest} />
          <i className='fa fa-flag' aria-hidden='true' onClick={this._handleFlagClick} style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
          { this.props.rev.deleteable && <i onClick={this._handleDeletionRequest} className='fa fa-trash' aria-hidden='true' /> }
          {this.state.flagRequest && this._renderFlagSelect()}
        </div>
      </div>
    );
  }
}

export default RevisionRow;
