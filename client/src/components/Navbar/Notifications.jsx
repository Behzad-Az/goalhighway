import React, {Component} from 'react';
import NotifRow from './NotifRow.jsx';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  render() {
    return (
      <div id='notification-list' className='notification-list'>
        { this.props.notifications[0] ? this.props.notifications.map(notif => <NotifRow key={notif.id} notif={notif} /> ) : <h1>No notifications are available</h1> }
      </div>
    );
  }
}

export default Notifications;
