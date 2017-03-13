import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
import Notifications from './Notifications.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      userInfo: {},
      notifications: [],
      unViewedNotif: false
    };
    this.conditionData = this.conditionData.bind(this);
    this.handleHamburger = this.handleHamburger.bind(this);
    this.showNotifications = this.showNotifications.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    fetch('/api/usernavbardata', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this.conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  conditionData(resJSON) {
    if (resJSON) {
      resJSON.unViewedNotif = resJSON.notifications.reduce((a, b) => ({ unviewed: a.unviewed || b.unviewed }), { unviewed: false } ).unviewed;
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  handleHamburger() {
    let nav = document.getElementById('hamburger-menu');
    let className = nav.getAttribute('class');
    nav.className = className.includes(' is-active') ? 'nav-right nav-menu' : 'nav-right nav-menu is-active';
  }

  showNotifications() {
    let notifList = document.getElementById('notification-list');
    let className = notifList.getAttribute('class');
    notifList.className = className.includes(' is-enabled') ? 'notification-list' : 'notification-list is-enabled';
    if (className.includes(' is-enabled')) {
      notifList.className = 'notification-list';

      fetch('/api/users/currentuser/notifications/viewed', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ asOfTime: this.state.notifications[0] ? this.state.notifications[0].notif_created_at : '' })
      })
      .then(response => response.json())
      .then(resJSON => {
        if (!resJSON) { throw 'Server returned false'; }
      })
      .catch(err => console.error('Error while setting viewed notifications - ', err))
      .then(() => {
        let notifications = this.state.notifications.map(notif => {
          notif.unviewed = false;
          return notif;
        });
        let unViewedNotif = false;
        this.setState({ unViewedNotif, notifications });
      });

    } else {
      notifList.className = 'notification-list is-enabled';
    }
  }

  handleLogout() {
    fetch('/api/logout', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(() => browserHistory.push('/login'))
    .catch(() => console.error('Error in logout'));
  }

  render() {
    return (
      <nav className='nav logged-in has-shadow'>
        <div className='container'>
          <div className='nav-left'>
            <Link className='nav-item' to='/home'><img src='../../../images/goalhighway-logo.png' alt='Bulma logo' /></Link>
            <Link id='home-nav-btn' className='nav-item is-tab is-hidden-mobile' to='/home'>Home</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-mobile' to={`/institutions/${this.state.userInfo.inst_id}`}>Institutions</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-mobile' to={`/users/${this.state.userInfo.id}/jobs`}>Jobs</Link>
          </div>

          <Link className='nav-item' onClick={this.showNotifications}>
            <i className='fa fa-bell' aria-hidden='true' style={{ color: this.state.unViewedNotif ? '#9D0600' : 'inherit' }}/>
          </Link>

          <span className='nav-toggle' onClick={this.handleHamburger}>
            <span/>
            <span/>
            <span/>
          </span>
          <div id='hamburger-menu' className='nav-right nav-menu'>

            <Link id='home-nav-btn' className='nav-item is-tab is-hidden-tablet' to='/home'>Home</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-tablet' to={`/institutions/${this.state.userInfo.inst_id}`}>Institutions</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-tablet' to={`/users/${this.state.userInfo.id}/jobs`}>Jobs</Link>
            <span className='nav-item has-shadow'>Hello: {this.state.userInfo.username}</span>

            <Link className='nav-item is-tab' to={`/users/${this.state.userInfo.id}`}>
              <figure className='image is-16x16'>
                <img src='http://bulma.io/images/jgthms.png' />
              </figure>
              Profile
            </Link>
            <Link className='nav-item is-tab' onClick={this.handleLogout}>Log out</Link>
          </div>
        </div>
        <Notifications notifications={this.state.notifications} />
      </nav>
    );
  }
}

export default Navbar;
