import React, {Component} from 'react';

import Navbar from '../Navbar/Navbar.jsx';
import LeftSideBar from '../partials/LeftSideBar.jsx';
import RightSideBar from '../partials/RightSideBar.jsx';
import SearchBar from '../partials/SearchBar.jsx';
import ReactAlert from '../partials/ReactAlert.jsx';
import FeedsContainer from './FeedsContainer.jsx';

class FeedPage extends Component {
  constructor(props) {
    super(props);
    this.reactAlert = new ReactAlert();
    this.state = {
      dataLoaded: false,
      pageError: false,
      resumeReviewFeeds: [],
      courseFeeds: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData();
  }

  _loadComponentData(courseId, docId) {
    fetch('/api/users/currentuser/feed', {
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
      this.setState(resJSON);
    } else {
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
          <SearchBar />
          <FeedsContainer resumeReviewFeeds={this.state.resumeReviewFeeds} courseFeeds={this.state.courseFeeds} />
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
      <div className='feed-page'>
        <Navbar />
        <LeftSideBar />
        { this._renderPageAfterData() }
        <RightSideBar />
        { this.reactAlert.container }
      </div>
    );
  }
}

export default FeedPage;
