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
      courseFeeds: [],
      noMoreFeeds: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
    this._displayLoadMoreBtn = this._displayLoadMoreBtn.bind(this);
  }

  componentDidMount() {
    this._loadComponentData();
  }

  _loadComponentData() {
    fetch(`/api/users/currentuser/feed?coursefeedoffset=${this.state.courseFeeds.length}&resumefeedoffset=${this.state.resumeReviewFeeds.length}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      this.setState({
        courseFeeds: this.state.courseFeeds.concat(resJSON.courseFeeds),
        resumeReviewFeeds: this.state.resumeReviewFeeds.concat(resJSON.resumeReviewFeeds),
        dataLoaded: true,
        noMoreFeeds: !resJSON.courseFeeds.length && !resJSON.resumeReviewFeeds.length
      });
    } else {
      throw 'Server returned false';
    }
  }

  _displayLoadMoreBtn() {
    let btnContent = this.state.noMoreFeeds && (this.state.courseFeeds.length || this.state.resumeReviewFeeds.length) ? 'No more feed item' : 'Load more feed items';
    if (this.state.courseFeeds.length || this.state.resumeReviewFeeds.length) {
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={this._loadComponentData}>{btnContent}</button>
        </p>
      );
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
          { this._displayLoadMoreBtn() }
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
