import React, {Component} from 'react';
import ControlSideBarRow from './ControlSideBarRow.jsx';

class ControlSideBar extends Component {

  render() {
    return (
      <div id='control-bar' className='card control-sidebar'>
        <p className='title is-4'>Conversations:</p>
        <hr />
        { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(email => <ControlSideBarRow key={email} /> ) }
      </div>
    );
  }

}

export default ControlSideBar;
