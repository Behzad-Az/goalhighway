import React, {Component} from 'react';
import ConversationRow from './ConversationRow.jsx';

class ConversationContainer extends Component {

  render() {
    return (
      <div className='card conversation-container'>
        <p className='title is-4'>I have reviewed your resume!</p>
        <hr />
        { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(conversation => <ConversationRow key={conversation} /> ) }
      </div>
    );
  }

}

export default ConversationContainer;
