import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';

class NewEmailForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      subject: this.props.emailParams.subject,
      content: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleSendEmail = this._handleSendEmail.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.emailParams.subject !== this.state.subject) {
      this.setState({ subject: nextProps.emailParams.subject });
    }
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.subject &&
           this.state.content &&
           this.props.emailParams.type &&
           this.props.emailParams.objId &&
           this.props.emailParams.toId;
  }

  _handleSendEmail() {
    let data = {
      toId: this.props.emailParams.toId,
      type: this.props.emailParams.type,
      objId: this.props.emailParams.objId,
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
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to send email', 'error'))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Compose Message:</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <label className='label'>Subject:</label>
            <p className='control'>
              <input className='input' type='text' name='subject' placeholder='Enter email subject here' value={this.state.subject} onChange={this._handleChange} />
            </p>
            <label className='label'>Content:</label>
            <p className='control'>
              <textarea className='textarea' name='content' placeholder='Enter email message here.' onChange={this._handleChange} />
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleSendEmail}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewEmailForm;
