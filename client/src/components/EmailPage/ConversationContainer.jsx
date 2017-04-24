import React, {Component} from 'react';
import ReactAlert from '../partials/ReactAlert.jsx';
import ConversationRow from './ConversationRow.jsx';
import NewReplyForm from './NewReplyForm.jsx';

class ConversationContainer extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      showNewReplyForm: false
    };
    this._toggleNewReplyForm = this._toggleNewReplyForm.bind(this);
    this._handleDeleteEmail = this._handleDeleteEmail.bind(this);
  }

  _toggleNewReplyForm() {
    this.setState({ showNewReplyForm: !this.state.showNewReplyForm });
  }

  _handleDeleteEmail() {
    fetch(`/api/emails/${this.props.email.id}`, {
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
        this.reactAlert.showAlert('Email deleted', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to delete email', 'error'));
  }

  render() {
    return (
      <div className='card conversation-container'>
        <NewReplyForm
          email={this.props.email}
          reload={this.props.reload}
          showModal={this.state.showNewReplyForm}
          toggleModal={this._toggleNewReplyForm}
        />
        <div className='actions'>
          <i className='fa fa-mail-reply' onClick={this._toggleNewReplyForm} />
          <i className='fa fa-trash' onClick={this._handleDeleteEmail} />
        </div>
        <p className='title is-4'>{this.props.email.subject}</p>
        <hr />
        { this.props.email.conversations.map(conversation => <ConversationRow key={conversation.id} conversation={conversation} photoName={this.props.email.photo_name} /> ) }
      </div>
    );
  }

}

export default ConversationContainer;
