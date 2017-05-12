import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewConvForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      subject: { min: 3, max: 60 },
      content: { min: 3, max: 500 }
    };
    this.state = {
      subject: this.props.convParams.subject,
      content: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._submitConversation = this._submitConversation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.convParams.subject !== this.state.subject) {
      this.setState({ subject: nextProps.convParams.subject });
    }
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.subject.length >= this.formLimits.subject.min &&
           !InvalidCharChecker(this.state.subject, this.formLimits.subject.max, 'convSubject') &&
           this.state.content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(this.state.content, this.formLimits.content.max, 'convContent') &&
           this.props.convParams.type &&
           this.props.convParams.objId &&
           this.props.convParams.toId;
  }

  _submitConversation() {
    let data = {
      toId: this.props.convParams.toId,
      type: this.props.convParams.type,
      objId: this.props.convParams.objId,
      subject: this.state.subject,
      content: this.state.content
    };

    fetch('/api/conversations', {
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
        this.reactAlert.showAlert('Conversation Sent', 'info');
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to send conversation', 'error'))
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
            <label className='label'>
              Subject:
              { InvalidCharChecker(this.state.subject, this.formLimits.subject.max, 'convSubject') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <input
                className='input'
                type='text'
                name='subject'
                placeholder='Enter subject here'
                value={this.state.subject}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.subject, this.formLimits.subject.max, 'convSubject') ? '#9D0600' : '' }} />
            </p>
            <label className='label'>
              Message:
              { InvalidCharChecker(this.state.content, this.formLimits.content.max, 'convContent') && <span className='char-limit'>Invalid</span> }
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='content'
                placeholder='Enter message here.'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.content, this.formLimits.content.max, 'convContent') ? '#9D0600' : '' }} />
            </p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._submitConversation}>Submit</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewConvForm;
