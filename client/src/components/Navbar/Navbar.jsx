import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
import Notifications from './Notifications.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      notifications: [],
      unViewedNotif: false
    };
    this.handleHamburger = this.handleHamburger.bind(this);
    this.showNotifications = this.showNotifications.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/api/usernavbardata',
      dataType: 'JSON',
      success: response => {
        let newState = {
          ...response,
          unViewedNotif: response.notifications.reduce((a, b) => ({ unviewed: a.unviewed || b.unviewed }), { unviewed: false } ).unviewed
        };
        response ? this.setState(newState) : console.error('server error - 0', response);
      }
    });
  }

  handleHamburger(e) {
    e.preventDefault();
    let nav = document.getElementById('hamburger-menu');
    let className = nav.getAttribute('class');
    nav.className = className.includes(' is-active') ? 'nav-right nav-menu' : 'nav-right nav-menu is-active';
  }

  showNotifications(e) {
    e.preventDefault();
    let notifList = document.getElementById('notification-list');
    let className = notifList.getAttribute('class');
    notifList.className = className.includes(' is-enabled') ? 'notification-list' : 'notification-list is-enabled';
    if (className.includes(' is-enabled')) {
      notifList.className = 'notification-list';
      $.ajax({
        method: 'POST',
        url: `/api/users/${this.state.userInfo.id}/notifications/viewed`,
        data: { asOfTime: this.state.notifications[0] ? this.state.notifications[0].notif_created_at : '' },
        success: response => {
          response ? console.log('Message 93: notifications set to seen') : console.error('Error in server 0 - ', response);
        }
      }).always(() => {
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
    $.ajax({
      method: 'GET',
      url: '/api/logout',
      dataType: 'JSON',
      success: response => {
        response ? browserHistory.push('/login') : console.error('Error in server - 0: ', response);
      }
    });
  }

  render() {
    return (
      <nav className='nav logged-in has-shadow'>
        <div className='container'>
          <div className='nav-left'>
            <Link className='nav-item' to='/home'><img src='../../../public/images/goalhighway-logo.png' alt='Bulma logo' /></Link>
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
