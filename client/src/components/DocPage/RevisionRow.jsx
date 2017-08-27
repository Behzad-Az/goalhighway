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
    this._handleRequestDownload = this._handleRequestDownload.bind(this);
    this._handleDeleteRequest = this._handleDeleteRequest.bind(this);
    this._handleFlagSubmit = this._handleFlagSubmit.bind(this);
    this._renderFlagSelect = this._renderFlagSelect.bind(this);
  }

  _handleRequestDownload() {
    fetch(`/api/courses/${this.props.courseId}/docs/${this.props.docId}/revisions/${this.props.rev.id}/download`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.status === 200) { return response.blob(); }
      else { throw 'Server returned false.'; }
    })
    .then(blob => download(blob, this.props.rev.title))
    .catch(err => console.error('Unable to download file: - ', err));
  }

  _handleDeleteRequest() {
    fetch(`/api/courses/${this.props.courseId}/docs/${this.props.docId}/revisions/${this.props.rev.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/string',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        resJSON.url === `/courses/${this.props.courseId}/docs/${this.props.docId}` ?
          this.props.reload(this.props.courseId, this.props.docId) :
          browserHistory.push(resJSON.url);
      } else {
        throw 'Server returned false';
      }
    })
    .catch(err => console.error('Unable to delete revision - ', err));
  }

  _handleFlagSubmit(e) {
    if (e.target.value) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      fetch(`/api/flags/revisions/${this.props.rev.id}`, {
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
      <p className='control flag-submission'>
        <span className='select is-small'>
          <select name='flagReason' onChange={this._handleFlagSubmit}>
            <option value=''>select reason</option>
            <option value='inappropriate content'>Inappropriate content</option>
            <option value='does not belong to this course'>Doesn't belong to this course</option>
            <option value='corrupted file or unreadable'>Corrupted file / unreadable</option>
            <option value='spam'>Spam</option>
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
          <i className='fa fa-download' aria-hidden='true' onClick={this._handleRequestDownload} />
          <i className='fa fa-flag'
            aria-hidden='true'
            onClick={() => this.setState({ flagRequest: !this.state.flagRequest })}
            style={{ color: this.state.flagRequest ? '#9D0600' : 'inherit' }} />
          { this.props.rev.editable && <i onClick={this._handleDeleteRequest} className='fa fa-trash' aria-hidden='true' /> }
          {this.state.flagRequest && this._renderFlagSelect()}
        </div>
      </div>
    );
  }
}

export default RevisionRow;
