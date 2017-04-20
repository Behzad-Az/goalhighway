import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewEmailForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      subject: '',
      content: '',
      toId: true
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleSendEmail = this._handleSendEmail.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.subject &&
           this.state.content &&
           this.state.toId;
  }

  _handleSendEmail() {
    let data = {
      toId: this.state.toId,
      subject: this.state.subject,
      content: this.state.content
    };

    fetch('/api/emails', {
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
      if (resJSON) {
        this.reactAlert.showAlert('Email Sent', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to send email', 'error'))
    .then(() => HandleModal('new-email-form'));
  }

  render() {
    return (
      <div id='new-email-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-email-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Compose Email</p>
            <button className='delete' onClick={() => HandleModal('new-email-form')}></button>
          </header>
          <section className='modal-card-body'>

            <label className='label'>Email Subject:</label>
            <p className='control'>
              <input className='input' type='text' name='subject' placeholder='Enter email subject here' defaultValue={this.state.subject} onChange={this._handleChange} />
            </p>

            <label className='label'>Email Content:</label>
            <p className='control'>
              <textarea className='textarea' name='content' placeholder='Enter email message here.' onChange={this._handleChange} />
            </p>

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleSendEmail}>Submit</button>
            <button className='button' onClick={() => HandleModal('new-email-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewEmailForm;
