import React, {Component} from 'react';
import ReactAlert from './ReactAlert.jsx';
import HandleModal from './HandleModal.js';

class NewReqAssistForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      issueDesc: this.props.courseInfo.latestAssistRequest,
      assistReqOpen: this.props.courseInfo.assistReqOpen,
      closureReason: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._formFooterOptions = this._formFooterOptions.bind(this);
    this._handleUpdateRequestAssist = this._handleUpdateRequestAssist.bind(this);
    this._handleNewRequestAssist = this._handleNewRequestAssist.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      issueDesc: nextProps.courseInfo.latestAssistRequest,
      assistReqOpen: nextProps.courseInfo.assistReqOpen
    });
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.issueDesc &&
           this.state.issueDesc.length <= 400;
  }

  _formFooterOptions() {
    if (this.state.assistReqOpen) {
      return (
        <footer className='modal-card-foot'>
          <p className='control'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={() => this._handleUpdateRequestAssist('update')}>Update</button>
            <span className='select'>
              <select name='closureReason' onChange={this._handleChange}>
                <option value=''>-</option>
                <option value='Resolved on my own'>Resolved on my own</option>
                <option value='Resolved with tutor'>Resolved with tutor</option>
                <option value='No longer needed'>No longer needed</option>
                <option value='Other'>Other</option>
              </select>
            </span>
            <button className='button' onClick={() => this._handleUpdateRequestAssist('close')} disabled={!this.state.closureReason}>Close Request</button>
          </p>
        </footer>
      );
    } else {
      return (
        <footer className='modal-card-foot'>
          <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewRequestAssist}>Submit</button>
          <button className='button' onClick={() => HandleModal('new-request-assist-form')}>Cancel</button>
        </footer>
      );
    }
  }

  _handleUpdateRequestAssist(action) {
    let data = {
      action: action,
      issueDesc: this.state.issueDesc,
      closureReason: this.state.closureReason
    };

    fetch(`/api/users/currentuser/courses/${this.props.courseInfo.id}/tutorlog/update`, {
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
    .catch(err => console.error('Unable to update or close assistance request - ', err))
    .then(() => HandleModal('new-request-assist-form'));
  }

  _handleNewRequestAssist() {
    let data = {
      issueDesc: this.state.issueDesc
    };

    fetch(`/api/users/currentuser/courses/${this.props.courseInfo.id}/tutorlog`, {
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
    .catch(err => console.error('Unable to post assistance request - ', err))
    .then(() => HandleModal('new-request-assist-form'));
  }

  render() {
    return (
      <div id='new-request-assist-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-request-assist-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Request Assistance</p>
            <button className='delete' onClick={() => HandleModal('new-request-assist-form')}></button>
          </header>
          <section className='modal-card-body'>
            <p className='control'>
              <textarea className='textarea' name='issueDesc' placeholder='How may one of our tutors assist you?' value={this.state.issueDesc} onChange={this._handleChange} />
            </p>
          </section>
          { this._formFooterOptions() }
        </div>
      </div>
    );
  }
}

export default NewReqAssistForm;
