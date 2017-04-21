import React, {Component} from 'react';
import ControlSideBarRow from './ControlSideBarRow.jsx';

class ControlSideBar extends Component {
  render() {
    return (
      <div id='control-bar' className='card control-bar'>
        <p className='title is-4'>Conversations:</p>
        <hr />
        { this.props.emails.map(email => <ControlSideBarRow key={email.id} email={email} selectEmail={this.props.selectEmail} /> ) }
        { !this.props.emails[0] && <p>No more emails available to view.</p> }
      </div>
    );
  }

}

export default ControlSideBar;
