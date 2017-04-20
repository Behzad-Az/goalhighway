import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';
import ConversationRow from './ConversationRow.jsx';
import NewReplyForm from './NewReplyForm.jsx';

class ConversationContainer extends Component {

  render() {
    return (
      <div className='card conversation-container'>
        <NewReplyForm email={this.props.email} />
        <div className='actions'>
          <i className='fa fa-mail-reply' onClick={() => HandleModal('new-reply-form')} />
          <i className='fa fa-trash' />
        </div>
        <p className='title is-4'>{this.props.email.subject}</p>
        <hr />
        { this.props.email.conversations.map(conversation => <ConversationRow key={conversation.id} conversation={conversation} photoName={this.props.email.photo_name} /> ) }
      </div>
    );
  }

}

export default ConversationContainer;
