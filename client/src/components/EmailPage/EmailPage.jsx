import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import HandleModal from '../partials/HandleModal.js';
import NewEmailForm from './NewEmailForm.jsx';
import ControlSideBar from './ControlSideBar.jsx';
import ConversationContainer from './ConversationContainer.jsx';

class EmailPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      emails: [],
      currEmailId: ''
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._toggleControlBar = this._toggleControlBar.bind(this);
    this._selectEmail = this._selectEmail.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData();
  }

  _loadComponentData() {
    fetch('/api/emails', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      resJSON.dataLoaded = true;
      resJSON.currEmailId = resJSON.emails[0] ? resJSON.emails[0].id : '';
      this.setState(resJSON);
    } else {
      throw 'Server returned false';
    }
  }

  _toggleControlBar() {
    let controlBar = document.getElementById('control-bar');
    let className = controlBar.getAttribute('class');
    controlBar.className = className.includes(' is-enabled') ? 'card control-bar' : 'card control-bar is-enabled';
  }

  _selectEmail(currEmailId) {
   this.setState({ currEmailId });
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
          <SearchBar />
          <NewEmailForm />
          <button onClick={() => HandleModal('new-email-form')}>Compose</button>
          { this.state.emails[0] && <ConversationContainer email={this.state.emails.find(email => email.id === this.state.currEmailId)} /> }
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
      <div className='email-page'>
        <Navbar />
        <div className='hamburger'>
          <i className='fa fa-navicon' onClick={this._toggleControlBar} />
        </div>
        <ControlSideBar
          reload={this._loadComponentData}
          toggleControlBar={this._toggleControlBar}
          emails={this.state.emails}
          selectEmail={this._selectEmail}
        />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default EmailPage;
