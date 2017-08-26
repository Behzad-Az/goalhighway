import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class NewReplyForm extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.formLimits = {
      content: { min: 3, max: 500 }
    };
    this.state = {
      content: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._submitReply = this._submitReply.bind(this);
  }

  _handleChange(e) {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  _validateForm() {
    return this.state.content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(this.state.content, this.formLimits.content.max, 'convContent') &&
           this.props.conversation.id;
  }

  _submitReply() {
    const data = {
      content: this.state.content
    };

    fetch(`/api/conversations/${this.props.conversation.id}`, {
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
        this.reactAlert.showAlert('Reply sent', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to send reply', 'error'))
    .then(this.props.toggleModal);
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.conversation.subject}</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            <p className='control'>
              <textarea
                className='textarea'
                name='content'
                placeholder='Enter message here.'
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.content, this.formLimits.content.max, 'convContent') ? '#9D0600' : '' }} />
            </p>
            { InvalidCharChecker(this.state.content, this.formLimits.content.max, 'convContent') && <p className='char-limit'>Invalid</p> }
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._submitReply}>Send</button>
            <button className='button' onClick={this.props.toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default NewReplyForm;
