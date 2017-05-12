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
    this._handleDeleteConversation = this._handleDeleteConversation.bind(this);
  }

  _toggleNewReplyForm() {
    this.setState({ showNewReplyForm: !this.state.showNewReplyForm });
  }

  _handleDeleteConversation() {
    fetch(`/api/conversations/${this.props.conversation.id}`, {
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
        this.reactAlert.showAlert('conversation deleted', 'info');
        this.props.reload();
      }
      else { throw 'Server returned false'; }
    })
    .catch(() => this.reactAlert.showAlert('Unable to delete conversation', 'error'));
  }

  render() {
    return (
      <div className='card conversation-container'>
        <NewReplyForm
          conversation={this.props.conversation}
          reload={this.props.reload}
          showModal={this.state.showNewReplyForm}
          toggleModal={this._toggleNewReplyForm}
        />
        <div className='actions'>
          <i className='fa fa-mail-reply' onClick={this._toggleNewReplyForm} />
          <i className='fa fa-trash' onClick={this._handleDeleteConversation} />
        </div>
        <p className='title is-4'>{this.props.conversation.subject}</p>
        <hr />
        { this.props.conversation.messages.map(message => <ConversationRow key={message.id} message={message} photoName={message.photo_name} /> ) }
      </div>
    );
  }

}

export default ConversationContainer;
