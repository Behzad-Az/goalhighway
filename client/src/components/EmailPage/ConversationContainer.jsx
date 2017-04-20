import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';
import ConversationRow from './ConversationRow.jsx';
import NewReplyForm from './NewReplyForm.jsx';

class ConversationContainer extends Component {

  render() {
    return (
      <div className='card conversation-container'>
        <NewReplyForm email={this.props.email} />
        <button onClick={() => HandleModal('new-reply-form')}>Reply</button>
        <p className='title is-4'>{this.props.email.subject}</p>
        <hr />
        { this.props.email.conversations.map(conversation => <ConversationRow key={conversation.id} conversation={conversation} photoName={this.props.email.photo_name} /> ) }
      </div>
    );
  }

}

export default ConversationContainer;
