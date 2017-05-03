import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

class Login extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      username: { min: 3, max: 30 },
      password: { min: 6, max: 30 }
    };
    this.state = {
      username: 'behzad',
      password: 'behzad123'
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this._validateUsername = this._validateUsername.bind(this);
    this._validateForm = this._validateForm.bind(this);
  }

  componentDidMount() {
    this._handleLogin();
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleLogin() {
    let data = {
      username: this.state.username,
      password: this.state.password
    };

    fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      resJSON ? browserHistory.push('/home') : this.props.handleBadInput(true, 'Invalid login credentials.');
    })
    .catch(err => console.error('Unable to process login - ', err));
  }

  _validateUsername() {
    return this.state.username.length <= this.formLimits.username.max &&
           this.state.username.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1;
  }

  _validatePassword() {
    return this.state.password.length <= this.formLimits.password.max &&
           this.state.password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1;
  }

  _validateForm() {
    return this.state.username.length >= this.formLimits.username.min && this._validateUsername () &&
           this.state.password.length >= this.formLimits.password.min && this._validatePassword();
  }

  render() {
    return (
      <nav className='nav login has-shadow'>
        <div className='container'>
          <div className='nav-left'>
            <Link className='nav-item logo' to='/home'><img src='../../../images/goalhighway-logo.png' alt='Bulma logo' /></Link>
          </div>
          <div className='nav-item credentials'>
            <div className='credential'>
              <label className='label'>
                Username:
                { !this._validateUsername() && <span className='char-limit'>Invalid</span> }
              </label>
              <input
                type='text'
                name='username'
                className='input is-primary'
                placeholder='Enter username'
                onChange={this._handleChange}
                style={{ borderColor: !this._validateUsername() ? '#9D0600' : '' }} />
            </div>
            <div className='credential'>
              <label className='label'>
                Password:
                { !this._validatePassword() && <span className='char-limit'>Invalid</span> }
              </label>
              <input
                type='password'
                name='password'
                className='input is-primary'
                placeholder='Enter password'
                onChange={this._handleChange}
                style={{ borderColor: !this._validatePassword() ? '#9D0600' : '' }} />
            </div>
            <button className='button' onClick={this._handleLogin} disabled={!this._validateForm()}>Log in</button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Login;
