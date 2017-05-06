import React, {Component} from 'react';
import ReactAlert from './ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewReqAssistForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      issueDesc: { min: 4, max: 500 }
    };
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
    return this.state.issueDesc.length >= this.formLimits.issueDesc.min &&
           !InvalidCharChecker(this.state.issueDesc, this.formLimits.issueDesc.max, 'tutorRequest');
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
            </span> <button className='button is-warning' onClick={() => this._handleUpdateRequestAssist('close')} disabled={!this.state.closureReason}>Close Request</button>
          </p>
        </footer>
      );
    } else {
      return (
        <footer className='modal-card-foot'>
          <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleNewRequestAssist}>Submit</button>
          <button className='button' onClick={this.props.toggleModal}>Cancel</button>
        </footer>
      );
    }
  }

  _handleUpdateRequestAssist(action) {
    let data = {
      action,
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
    .then(this.props.toggleModal);
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
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Request Assistance</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <p className='control'>
              <textarea
                className='textarea'
                name='issueDesc'
                placeholder='How may one of our tutors assist you?'
                value={this.state.issueDesc}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.issueDesc, this.formLimits.issueDesc.max, 'tutorRequest') ? '#9D0600' : '' }} />
            </p>
            { InvalidCharChecker(this.state.issueDesc, this.formLimits.issueDesc.max, 'tutorRequest') && <p className='char-limit'>too long!</p> }
          </section>
          { this._formFooterOptions() }
        </div>
      </div>
    );
  }
}

export default NewReqAssistForm;
