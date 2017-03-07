import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  handleLogin() {
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: this.state,
      success: response => {
        console.log("i'm here 3: ", response);
        response ? browserHistory.push("/home") : this.props.handleBadInput(true, 'Invalid login credentials.');
      }
    });
  }

  render() {
    return (
      <nav className="nav login has-shadow">
        <div className="container">
          <div className="nav-left">
            <Link className="nav-item logo" to={"/home"}><img src="../../../public/images/goalhighway-logo.png" alt="Bulma logo" /></Link>
          </div>
          <div className="nav-item credentials">
            <div className="credential">
              <label className="label">Username:</label>
              <input type='text' className="input is-primary"
                     placeholder="Enter username" name="username"
                     onChange={this.handleChange} />
            </div>
            <div className="credential">
              <label className="label">Password:</label>
              <input type='password' className="input is-primary"
                     placeholder="Enter password" name="password"
                     onChange={this.handleChange} />
            </div>
            <button className="button" onClick={this.handleLogin}>Log in</button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Login;
