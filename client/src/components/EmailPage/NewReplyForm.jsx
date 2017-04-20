import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import HandleModal from '../partials/HandleModal.js';

class NewReplyForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      content: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleSendReply = this._handleSendReply.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.content;
  }

  _handleSendReply() {
    let data = {
      content: this.state.content
    };

    fetch(`/api/emails/${this.props.email.id}`, {
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
        // this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to send email', 'error'))
    .then(() => HandleModal('new-reply-form'));
  }

  render() {
    return (
      <div id='new-reply-form' className='modal'>
        <div className='modal-background' onClick={() => HandleModal('new-reply-form')}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>RE: {this.props.email.subject}</p>
            <button className='delete' onClick={() => HandleModal('new-reply-form')}></button>
          </header>
          <section className='modal-card-body'>
            <p className='control'>
              <textarea className='textarea' name='content' placeholder='Enter email message here.' onChange={this._handleChange} />
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleSendReply}>Send</button>
            <button className='button' onClick={() => HandleModal('new-reply-form')}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewReplyForm;
