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
            <Link className='nav-item' to='/home'><img src='../../../images/goalhighway-logo.png' alt='Bulma logo' /></Link>
            <Link id='home-nav-btn' className='nav-item is-tab is-hidden-mobile' to='/home'>Home</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-mobile' to={`/institutions/${this.state.userInfo.inst_id}`}>Institutions</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-mobile' to='/jobs'>Jobs</Link>
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
            <Link id='home-nav-btn' className='nav-item is-tab is-hidden-tablet' to='/home'>Home</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-tablet' to={`/institutions/${this.state.userInfo.inst_id}`}>Institutions</Link>
            <Link id='institute-nav-btn' className='nav-item is-tab is-hidden-tablet' to='/jobs'>Jobs</Link>
            <span className='nav-item has-shadow'>Hello: {this.state.userInfo.username}</span>
            <Link className='nav-item is-tab' to='/profile'>Profile</Link>
            <Link className='nav-item is-tab' onClick={this._handleLogout}>Log out</Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
