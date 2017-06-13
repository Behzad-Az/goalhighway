import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import RightSideBar from '../RightSideBar/RightSideBar.jsx';
import ControlSideBar from './ControlSideBar.jsx';
import ConversationContainer from './ConversationContainer.jsx';

class ConversationPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      conversations: [],
      curreConvId: ''
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._toggleControlBar = this._toggleControlBar.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    document.title = 'GoalHwy - My Conversations';
    this._loadComponentData();
  }

  _loadComponentData() {
    fetch('/api/conversations', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      resJSON.conversations[0] ?
        this.setState({
          conversations: resJSON.conversations.sort((a, b) => a.messages[0].sent_at <= b.messages[0].sent_at ? 1 : -1),
          curreConvId: resJSON.conversations[0].id,
          dataLoaded: true
        }) :
        this.setState({
          conversations: [],
          curreConvId: '',
          dataLoaded: true
        });
    } else {
      throw 'Server returned false';
    }
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
          { this.state.conversations[0] && <ConversationContainer conversation={this.state.conversations.find(conv => conv.id == this.state.curreConvId)} reload={this._loadComponentData} /> }
          { !this.state.conversations[0] && <p>No message available to view.</p> }
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
      <div className='conversation-page'>
        <Navbar />
        <div className='hamburger'>
          <i className='fa fa-navicon' onClick={this._toggleControlBar} />
        </div>
        <ControlSideBar
          toggleControlBar={this._toggleControlBar}
          conversations={this.state.conversations}
          selectConversation={curreConvId => this.setState({ curreConvId })}
        />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default ConversationPage;
