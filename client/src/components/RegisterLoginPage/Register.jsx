import React, {Component} from 'react';
import { Link } from 'react-router';
import SingleSelect from '../partials/SingleSelect.jsx';
import InvalidCharChecker from '../partials/InvalidCharChecker.jsx';

class Register extends Component {
  constructor(props) {
    super(props);
    this.academicYears = [ { value: 1, label: 'Year 1'}, { value: 2, label: 'Year 2'}, { value: 3, label: 'Year 3'}, { value: 4, label: 'Year 4'}, { value: 5, label: 'Year 5'}, { value: 6, label: 'Year 6'} ];
    this.emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    this.formLimits = {
      username: { min: 3, max: 30 },
      password: { min: 6, max: 30 },
      passwordConfirm: { min: 6, max: 30 },
      email: { min: 6, max: 30 }
    };
    this.state = {
      dataLoaded: false,
      pageError: false,
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      instId: '',
      progId: '',
      userYear: '',
      instProgDropDownList: [],
      usernameAvaialble: false,
      emailAvaialble: false,
      processing: false
    };
    this._conditionData = this._conditionData.bind(this);
    this._handleInstChange = this._handleInstChange.bind(this);
    this._handleProgChange = this._handleProgChange.bind(this);
    this._handleUserYearChange = this._handleUserYearChange.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._getUserAvailability = this._getUserAvailability.bind(this);
    this._getEmailAvailability = this._getEmailAvailability.bind(this);
    this._validateUsername = this._validateUsername.bind(this);
    this._validatePassword = this._validatePassword.bind(this);
    this._validateEmail = this._validateEmail.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._handleRegister = this._handleRegister.bind(this);
  }

  componentDidMount() {
    fetch('/api/institutions_programs', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      const instProgDropDownList = resJSON.insts.map(inst => {
        const programs = inst.programs.map(prog => {
          return { value: prog.id, label: prog.prog_display_name };
        });
        return { value: inst.id, label: inst.inst_display_name, programs };
      });
      this.setState({ instProgDropDownList, dataLoaded: true });
    } else {
      throw 'Server returned false';
    }
  }

  _handleInstChange(instId) {
    this.setState({ instId });
  }

  _handleProgChange(progId) {
    this.setState({ progId });
  }

  _handleUserYearChange(userYear) {
    this.setState({ userYear });
  }

  _handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  _getUserAvailability(e) {
    let username = e.target.value.toLowerCase().trim();
    if (this._validateUsername(username)) {
      fetch('/api/username_availability', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
      .then(response => response.json())
      .then(usernameAvaialble => this.setState({ usernameAvaialble, username }));
    } else {
      this.setState({ usernameAvaialble: false, username });
    }
  }

  _getEmailAvailability(e) {
    let email = e.target.value.toLowerCase().trim();
    if (this._validateEmail(email)) {
      fetch('/api/email_availability', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      .then(response => response.json())
      .then(emailAvaialble => this.setState({ emailAvaialble, email }));
    } else {
      this.setState({ emailAvaialble: false, email });
    }
  }

  _validateUsername(username) {
    return username.length >= this.formLimits.username.min &&
           !InvalidCharChecker(username, this.formLimits.username.max, 'username');
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

  _validateEmail(email) {
    return email.length >= this.formLimits.email.min &&
           email.length <= this.formLimits.email.max &&
           email.match(this.emailRegex);
  }

  _validateForm() {
    return this._validateUsername(this.state.username) &&
           this._validatePassword() &&
           this._validatePasswordConfirm() &&
           this._validateEmail(this.state.email) &&
           this.state.instId &&
           this.state.progId &&
           this.state.userYear &&
           this.state.emailAvaialble &&
           this.state.usernameAvaialble &&
           !this.state.processing;
  }

  _handleRegister() {
    this.setState({ processing: true });

    let data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      instId: this.state.instId,
      progId: this.state.progId,
      userYear: this.state.userYear
    };

    fetch('/api/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => resJSON ? this.props.handleRegisterSuccess(true) : this.props.handleError(true, 'Unable to register new user.'))
    .catch(err => console.error('Unable to process registeration - ', err))
    .then(() => this.setState({ processing: false }));
  }

  render() {
    let programList = this.state.instId ? this.state.instProgDropDownList.find(item => item.value === this.state.instId).programs : [];
    return (
      <div className='card'>
        <header className='card-header'>
          <p className='card-header-title'>
            Register Here
          </p>
        </header>

        <div className='card-content'>
          <div className='control'>
            <label className='label'>
              Username: { this.state.usernameAvaialble && <i className='fa fa-check' /> }
            </label>
            <input
              type='text'
              className='input is-primary'
              placeholder='Enter username'
              name='username'
              onChange={this._getUserAvailability}
              disabled={this.state.processing} />
          </div>
          <div className='control'>
            <label className='label'>
              Email: { this.state.emailAvaialble && <i className='fa fa-check' /> }
            </label>
            <input
              type='email'
              className='input is-primary'
              placeholder='Enter email'
              name='email'
              onChange={this._getEmailAvailability}
              disabled={this.state.processing} />
          </div>
          <div className='control'>
            <label className='label'>
              Password: { this._validatePassword() && <i className='fa fa-check' /> }
            </label>
            <input
              type='password'
              className='input is-primary'
              placeholder='minium six characters | one letter | one digit'
              name='password'
              onChange={this._handleChange}
              disabled={this.state.processing} />
          </div>
          <div className='control'>
            <label className='label'>
              Confirm Password: { this._validatePasswordConfirm() && <i className='fa fa-check' /> }
            </label>
            <input
              type='password'
              className='input is-primary'
              placeholder='minium six characters | one letter | one digit'
              name='passwordConfirm'
              onChange={this._handleChange}
              disabled={this.state.processing} />
          </div>
          <div className='control'>
            <label className='label'>
              Primary Institution: { this.state.instId && <i className='fa fa-check' /> }
            </label>
            <SingleSelect
              disabled={this.state.processing}
              initialValue={this.state.instId}
              options={this.state.instProgDropDownList}
              name='instId'
              handleChange={this._handleInstChange} />
          </div>
          <div className='control'>
            <label className='label'>
              Primary Program: { this.state.progId && <i className='fa fa-check' /> }
            </label>
            <SingleSelect
              disabled={this.state.processing}
              initialValue={this.state.progId}
              options={programList}
              name='progId'
              handleChange={this._handleProgChange} />
          </div>
          <div className='control'>
            <label className='label'>
              Primary Academic Year: { this.state.userYear && <i className='fa fa-check' /> }
            </label>
            <SingleSelect
              disabled={this.state.processing}
              initialValue={this.state.userYear}
              options={this.academicYears}
              name='userYear'
              handleChange={this._handleUserYearChange} />
          </div>
        </div>

        <footer className='card-footer'>
          <Link className='card-footer-item button is-link' onClick={this._handleRegister} disabled={!this._validateForm()}>
            { this.state.processing ? 'Registering...' : 'Register!' }
          </Link>
        </footer>
      </div>
    );
  }
}

export default Register;
