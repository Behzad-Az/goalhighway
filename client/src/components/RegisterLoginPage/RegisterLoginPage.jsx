import React, {Component} from 'react';
import Login from './Login.jsx';
import Register from './Register.jsx';
import IntroDescription from './IntroDescription.jsx';
import SocialNumbers from './SocialNumbers.jsx';
import Footer from './Footer.jsx';

class LoginRegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerStatus: false,
      errorStatus: false,
      errorMsg: ''
    };
    this._handleRegisterSuccess = this._handleRegisterSuccess.bind(this);
    this._handleError = this._handleError.bind(this);
    this._registerMsg = this._registerMsg.bind(this);
    this._errorMsg = this._errorMsg.bind(this);
  }

  _handleRegisterSuccess(registerStatus) {
    this.setState({ registerStatus });
  }

  _handleError(errorStatus, errorMsg) {
    this.setState({ errorStatus, errorMsg });
  }

  _registerMsg() {
    if (this.state.registerStatus) {
      return (
        <article className='message is-success'>
          <div className='message-header'>
            <p><strong>Thank you for registring and welcome!</strong>!</p>
            <button className='delete' onClick={() => this._handleRegisterSuccess(false)} />
          </div>
          <div className='message-body'>
            Check your email and verify your account.
          </div>
        </article>
      );
    }
  }

  _errorMsg() {
    if (this.state.errorStatus) {
      return (
        <article className='message is-danger'>
          <div className='message-header'>
            <strong>Invalid entry!</strong>
            <button className='delete' onClick={() => this._handleError(false, '')} />
          </div>
          <div className='message-body'>
            { this.state.errorMsg }
          </div>
        </article>
      );
    }
  }

  render() {
    return (
      <div className='register-login-page'>
        <Login handleError={this._handleError} />
        <div className='main-container'>
          { this._errorMsg() }
          { this._registerMsg() }
          <Register handleError={this._handleError} handleRegisterSuccess={this._handleRegisterSuccess} />
          <IntroDescription />
          <SocialNumbers />
          <Footer />
        </div>
      </div>
    );
  }
}

export default LoginRegisterPage;
