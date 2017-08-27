import React, {Component} from 'react';
import { Link } from 'react-router';
import Login from '../RegisterLoginPage/Login.jsx';

class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: '',
      processing: false,
      successStatus: false,
      errorStatus: false
    };
    this._handlePasswordReset = this._handlePasswordReset.bind(this);
  }

  componentDidMount() {
    document.title = 'Forgot Account';
  }

  _renderSuccessMsg() {
    return (
      <article className='message is-success'>
        <div className='message-header'>
          <strong>We found your account!</strong>
          <button className='delete' onClick={() => this.setState({ successStatus: false })} />
        </div>
        <div className='message-body'>
          Check your email for more instructions.
        </div>
      </article>
    );
  }

  _renderErrorMsg() {
    return (
      <article className='message is-danger'>
        <div className='message-header'>
          <strong>Unable to find account!</strong>
          <button className='delete' onClick={() => this.setState({ errorStatus: false })} />
        </div>
        <div className='message-body'>
          Enter valid username or email address.
        </div>
      </article>
    );
  }

  _handlePasswordReset() {
    this.setState({ processing: true });
    fetch('/api/forgot_account', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usernameOrEmail: this.state.usernameOrEmail })
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.setState({ successStatus: true }) : this.setState({ errorStatus: true }))
    .catch(err => console.error('Unable to retrieve account - ', err))
    .then(() => this.setState({ processing: false }));
  }

  render() {
    return (
      <div className='forgot-account-page'>
        <Login handleError={this._handleError} />
        <div className='main-container'>
          { this.state.errorStatus && this._renderErrorMsg() }
          { this.state.successStatus && this._renderSuccessMsg() }
          <div className='card'>
            <header className='card-header'>
              <p className='card-header-title'>
                Enter username or email to find your account.
              </p>
            </header>
            <div className='card-content'>
              <div className='control'>
                <input
                  type='text'
                  className='input'
                  placeholder='Username Or Email'
                  name='usernameOrEmail'
                  onChange={e => this.setState({ usernameOrEmail: e.target.value.trim().toLowerCase() })}
                  disabled={this.state.processing} />
              </div>
            </div>
            <footer className='card-footer'>
              <Link className='card-footer-item button is-link' onClick={this._handlePasswordReset} disabled={!this.state.usernameOrEmail || this.state.processing}>
                { this.state.processing ? 'Processing...' : 'Find Account' }
              </Link>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPasswordPage;
