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
      dataLoaded: true,
      pageError: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
    this._toggleControlBar = this._toggleControlBar.bind(this);
  }

  componentDidMount() {

  }

  _loadComponentData() {

  }

  _conditionData(resJSON) {

  }

  _toggleControlBar() {
    let controlBar = document.getElementById('control-bar');
    let className = controlBar.getAttribute('class');
    controlBar.className = className.includes(' is-enabled') ? 'card control-bar' : 'card control-bar is-enabled';
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
          <ConversationContainer />
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
        <ControlSideBar reload={this._loadComponentData} toggleControlBar={this._toggleControlBar} />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default EmailPage;
