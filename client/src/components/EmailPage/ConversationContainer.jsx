import React, {Component} from 'react';
import ConversationRow from './ConversationRow.jsx';

class ConversationContainer extends Component {

  render() {
    return (
      <div className='card conversation-container'>
        <p className='title is-4'>{this.props.email.subject}</p>
        <hr />
        { this.props.email.conversations.map(conversation => <ConversationRow key={conversation.id} conversation={conversation} photoName={this.props.email.photo_name} /> ) }
      </div>
    );
  }

}

export default ConversationContainer;
