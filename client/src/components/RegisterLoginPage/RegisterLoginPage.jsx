import React, {Component} from 'react';

import Login from './Login.jsx';
import Register from './Register.jsx';

class LoginRegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerSuccessStatus: false,
      badInputStatus: false,
      errorMsg: ''
    };
    this.handleSuccessfulRegister = this.handleSuccessfulRegister.bind(this);
    this.handleBadInput = this.handleBadInput.bind(this);
    this.returnErrorMsg = this.returnErrorMsg.bind(this);
  }

  handleSuccessfulRegister(registerSuccessStatus) {
    this.setState({ registerSuccessStatus });
  }

  handleBadInput(badInputStatus, errorMsg) {
    this.setState({ badInputStatus, errorMsg });
  }

  returnRegisterSuccessMsg() {
    if (this.state.registerSuccessStatus) {
      return (
        <article className="message is-success">
          <div className="message-header">
            <p><strong>Thank you for registring and welcome!</strong>!</p>
            <button className="delete" onClick={() => this.handleSuccessfulRegister(false)} />
          </div>
          <div className="message-body">
            Please login.
          </div>
        </article>
      );
    }
  }

  returnErrorMsg() {
    if (this.state.badInputStatus) {
      return (
        <article className="message is-danger">
          <div className="message-header">
            <p><strong>Invalid entry!</strong>!</p>
            <button className="delete" onClick={() => this.handleBadInput(false, '')} />
          </div>
          <div className="message-body">
            { this.state.errorMsg }
          </div>
        </article>
      );
    }
  }

  render() {
    return (
      <div className="register-login-page">
        <Login handleBadInput={this.handleBadInput} />
        <div className="main-container">
          { this.returnErrorMsg() }
          { this.returnRegisterSuccessMsg() }
          <Register handleBadInput={this.handleBadInput} handleSuccessfulRegister={this.handleSuccessfulRegister} />
        </div>
      </div>
    );
  }
}

export default LoginRegisterPage;
