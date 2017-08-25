import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      userInfo: {},
      hamburgerClass: 'nav-right nav-menu'
    };
    this._conditionData = this._conditionData.bind(this);
    this._handleHamburger = this._handleHamburger.bind(this);
    this._handleLogout = this._handleLogout.bind(this);
  }

  componentDidMount() {
    fetch('/api/usernavbardata', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  _handleHamburger() {
    this.state.hamburgerClass === 'nav-right nav-menu is-active' ?
      this.setState({ hamburgerClass: 'nav-right nav-menu'}) :
      this.setState({ hamburgerClass: 'nav-right nav-menu is-active'});
  }

  _handleLogout() {
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
            <Link className='nav-item' to='/index'><img src='../../../images/goalhighway-logo-no-background.png' alt='Bulma logo' /></Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-mobile' to={`/institutions/${this.state.userInfo.inst_id}`}><i className='fa fa-graduation-cap' aria-hidden='true' />Academics</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-mobile' to='/jobs'><i className='fa fa-briefcase' aria-hidden='true' />Careers</Link>
          </div>
          <Link className='nav-item' to='/feed'>
            <i className='fa fa-feed' aria-hidden='true' style={{ color: this.state.userInfo.unviewed_notif ? '#9D0600' : 'inherit' }}/>
          </Link>
          <span className='nav-toggle' onClick={this._handleHamburger}>
            <span/>
            <span/>
            <span/>
          </span>
          <div id='hamburger-menu' className={this.state.hamburgerClass}>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-tablet' to={`/institutions/${this.state.userInfo.inst_id}`}><i className='fa fa-graduation-cap' aria-hidden='true' />Academics</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-tablet' to='/jobs'><i className='fa fa-briefcase' aria-hidden='true' />Careers</Link>
            <Link className='nav-item is-tab' to='/conversations'><i className='fa fa-envelope' aria-hidden='true' />Messages</Link>
            <Link className='nav-item is-tab' to='/profile'><i className='fa fa-user' aria-hidden='true' />Profile</Link>
            <Link className='nav-item is-tab' onClick={this._handleLogout}><i className='fa fa-sign-out' aria-hidden='true' />Logout</Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
