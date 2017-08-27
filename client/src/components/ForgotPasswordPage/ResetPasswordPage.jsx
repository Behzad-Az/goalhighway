import React, {Component} from 'react';
import { Link } from 'react-router';
import Login from '../RegisterLoginPage/Login.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      password: { min: 6, max: 30 },
      passwordConfirm: { min: 6, max: 30 }
    };
    this.state = {
      password: '',
      passwordConfirm: '',
      successStatus: false,
      errorStatus: false,
      processing: false
    };
    this._handlePasswordReset = this._handlePasswordReset.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._validatePassword = this._validatePassword.bind(this);
    this._validatePasswordConfirm = this._validatePasswordConfirm.bind(this);
    this._validateForm = this._validateForm.bind(this);
  }

  componentDidMount() {
    document.title = 'Change Password';
  }

  _handlePasswordReset() {
    this.setState({ processing: true });
    const data = {
      requestId: this.props.location.query.requestId,
      email: this.props.location.query.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    };
    fetch('/api/reset_password', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(err => console.error('Unable to change password - ', err))
    .then(() => this.setState({ processing: false }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState({ successStatus: true });
    } else {
      this.setState({ errorStatus: true });
      throw 'Server returned false';
    }
  }

  _validatePassword() {
    return this.state.password.length >= this.formLimits.password.min &&
           this.state.password.search(/\d/) != -1 &&
           this.state.password.search(/[a-zA-Z]/) != -1 &&
           !InvalidCharChecker(this.state.password, this.formLimits.password.max, 'password');
  }

  _validatePasswordConfirm() {
    return this._validatePassword() &&
           this.state.passwordConfirm === this.state.password;
  }

  _validateForm() {
    return !this.state.processing && this._validatePassword() && this._validatePasswordConfirm();
  }

  _renderSuccessMsg() {
    return (
      <article className='message is-success'>
        <div className='message-header'>
          <strong>Success!</strong>
          <button className='delete' onClick={() => this.setState({ successStatus: false })} />
        </div>
        <div className='message-body'>
          Login with your new password.
        </div>
      </article>
    );
  }

  _renderErrorMsg() {
    return (
      <article className='message is-danger'>
        <div className='message-header'>
          <strong>Error!</strong>
          <button className='delete' onClick={() => this.setState({ errorStatus: false })} />
        </div>
        <div className='message-body'>
          Unable to change password. Please try again.
        </div>
      </article>
    );
  }

  render() {
    return (
      <div className='reset-password-page'>
        <Login handleError={this._handleError} />
        <div className='main-container'>
          { this.state.errorStatus && this._renderErrorMsg() }
          { this.state.successStatus && this._renderSuccessMsg() }
          <div className='card'>
            <header className='card-header'>
              <p className='card-header-title'>
                Change your password here.
              </p>
            </header>
            <div className='card-content'>
              <div className='control'>
                <label className='label'>
                  New Password: { this._validatePassword() && <i className='fa fa-check' /> }
                </label>
                <input
                  type='password'
                  className='input'
                  placeholder='New password'
                  name='password'
                  onChange={e => this.setState({ password: e.target.value.trim().toLowerCase() })}
                  disabled={this.state.processing} />
              </div>
              <div className='control'>
                <label className='label'>
                  Confirm New Password: { this._validatePasswordConfirm() && <i className='fa fa-check' /> }
                </label>
                <input
                  type='password'
                  className='input'
                  placeholder='Confirm new password'
                  name='passwordConfirm'
                  onChange={e => this.setState({ passwordConfirm: e.target.value.trim().toLowerCase() })}
                  disabled={this.state.processing} />
              </div>
            </div>
            <footer className='card-footer'>
              <Link className='card-footer-item button is-link' onClick={this._handlePasswordReset} disabled={!this._validateForm()}>
                { this.state.processing ? 'Processing...' : 'Reset Password' }
              </Link>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPasswordPage;
