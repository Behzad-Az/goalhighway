import React, {Component} from 'react';
import Login from '../RegisterLoginPage/Login.jsx';

class RegisterConfirmPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'Confirm Registration';
    this._loadComponentData();
  }

  _loadComponentData() {
    const data = {
      email: this.props.location.query.email,
      registerToken: this.props.location.query.token
    };
    fetch(`/api/confirm_register`, {
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
    .catch(err => console.error('Unable to confirm registration - ', err));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState({ dataLoaded: true });
    } else {
      document.title = 'Confirm Registration - Error';
      throw 'Server returned false';
    }
  }

  _renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='main-container'>
          <h1 className='title is-4'>Your account is all ready to go now! Login with your credentials.</h1>
        </div>
      );
    } else {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
            <span className='sr-only'>Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='register-confirm-page'>
        <Login handleError={this._handleError} />
        { this._renderPageAfterData() }
      </div>
    );
  }
}

export default RegisterConfirmPage;
