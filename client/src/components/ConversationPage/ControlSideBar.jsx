import React, {Component} from 'react';
import ControlSideBarRow from './ControlSideBarRow.jsx';

class ControlSideBar extends Component {
  render() {
    return (
      <div id='control-bar' className='card control-bar'>
        <p className='title is-4'>Conversations:</p>
        <hr />
        { this.props.conversations.map(conversation => <ControlSideBarRow key={conversation.id} conversation={conversation} selectConversation={this.props.selectConversation} /> ) }
        { !this.props.conversations[0] && <p>No message available to view.</p> }
      </div>
    );
  }

}

export default ControlSideBar;
